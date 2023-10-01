import numpy as np
import pandas as pd
from nltk.tokenize import RegexpTokenizer
from nltk.corpus import stopwords
from nltk.stem.wordnet import WordNetLemmatizer
from nltk.stem import WordNetLemmatizer
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.cluster import KMeans
import matplotlib.pyplot as plt
import json

def main():
    #CSV headers: name, resume
    #new hire's dataset 
    file_path_to_new_hire_csv = './uploads/NewHireDataSet.csv'
    #insert internal employees data set
    file_path_to_employee_csv = 'UpdatedResumeDataSet.csv'
    #IMPORTING AND MERGING CSVs
    df_new_hire =pd.read_csv(file_path_to_new_hire_csv, header = 1, names=['Names','Resumes'])
    df_employee = pd.read_csv(file_path_to_employee_csv, header = 1, names=['Names','Resumes'])
    df = pd.concat([df_new_hire, df_employee]).reset_index(drop=True)
    print(df.info())

    #CLEANING
    df['text_token'] = df['Resumes'].str.replace('[^a-zA-Z\s]', '', regex=True)
    df['text_lower'] = df['text_token'].str.lower()

    wordnet_lem = WordNetLemmatizer()

    df['text_lem'] = df['text_lower'].apply(wordnet_lem.lemmatize)
    df.head(3)

    regexp = RegexpTokenizer('\w+')
    df['text_token'] = df['text_lem'].apply(regexp.tokenize)
    df.head(3)


    stopwords_set = set(stopwords.words())
    stopwords_set.update(['education', 'details', 'skill', 'technical', 'languages', 'technologies','areas', 'interest'])
    df['text_token'] = df['text_token'].apply(lambda x: [item for item in x if item not in stopwords_set])
    df.head(3)


    df['text_cleaned'] = df['text_token'].apply(lambda x: ' '.join(x))
    df.head(5)
    #CLEANING DONE

    #VECTORISING
    vectoriser = TfidfVectorizer()
    x = vectoriser.fit_transform(df['text_cleaned'])
    with np.printoptions(threshold= np.inf):
        print(x.toarray()[0])
    #VECTORISING DONE

    #KMEANS
    kmeans_kwargs = {
    "init": "random",
    "n_init": 10,
    "max_iter": 300,
    "random_state": 42,
    }
    sse = []
    r = range(4, 14)
    for k in r:
        kmeans = KMeans(n_clusters=k, **kmeans_kwargs)
        kmeans.fit(x)
        sse.append(kmeans.inertia_)
    #KMEANS DONE

    #PLOTTING
    plt.style.use("fivethirtyeight")
    plt.plot(r, sse)
    plt.xticks(r)
    plt.xlabel("Number of Clusters")
    plt.ylabel("SSE")
    plt.show()
    #PLOTTED


    labels = kmeans.labels_ 
    df['label'] = labels
    df[df.label == 7].head(20)
    centroids  = kmeans.cluster_centers_
    print(centroids)
    n_new_hires = df_new_hire.shape[0]
    list_of_scores = []
    for i in range(n_new_hires):
        new_hire_errors = []
        for c in centroids:
            diff = x.toarray()[i] - c
            new_hire_errors.append(np.sum(np.multiply(diff, diff)))
        list_of_scores[i] = np.amin(new_hire_errors)
    list_of_scores = list(map(lambda x: 100 - 70*x, list_of_scores))
    list_of_names = df_new_hire['Names'].tolist() 


    dictionary_of_names_scores = {}

    for i in range(len(list_of_names)):
        dictionary_of_names_scores[list_of_names[i]] = list_of_scores[i]

    json_object_names_scores = json.dumps(dictionary_of_names_scores, indent = 2)
    print(json_object_names_scores)
    return json_object_names_scores

if __name__ == "__main__":
    main()