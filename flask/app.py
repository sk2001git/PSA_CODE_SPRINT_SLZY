from flask import Flask, request, jsonify
import json
import backend
import os

app = Flask(__name__)

UPLOAD_FOLDER = 'uploads'  # Create a directory named 'uploads' to store uploaded files
if not os.path.exists(UPLOAD_FOLDER):    os.makedirs(UPLOAD_FOLDER)
@app.route('/your-api-endpoint', methods=['POST'])
def upload_file():    
    try:
        uploaded_file = request.files['file']        
        if uploaded_file.filename != '':
            file_path = os.path.join(UPLOAD_FOLDER, uploaded_file.filename)            
            uploaded_file.save(file_path)
            return jsonify({"message": "File uploaded successfully"})        
        else:
            return jsonify({"error": "No file provided"}), 400 
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
if __name__ == '__main__':    app.run(debug=True)

