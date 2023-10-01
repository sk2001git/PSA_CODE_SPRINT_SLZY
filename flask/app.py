
from flask import Flask, request, jsonify
import json
import backend
import os
from flask_cors import CORS 
app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = 'uploads'  # Create a directory named 'uploads' to store uploaded files
@app.route('/your-api-endpoint', methods=['POST'])
def upload_file():    
    try:
        uploaded_file = request.files['file']        
        if uploaded_file.filename != '':
            if not os.path.exists(UPLOAD_FOLDER):    
                os.makedirs(UPLOAD_FOLDER)
            file_path = os.path.join(UPLOAD_FOLDER, uploaded_file.filename)    
            print(file_path)        
            uploaded_file.save(file_path)
            data = backend.main()
            
            return data, 200
        else:
            return jsonify({"name": "No file provided"}), 400 
        
    except Exception as e:
        return jsonify({"name": str(e)}), 500
    
if __name__ == '__main__':    
    app.run(debug=True)

