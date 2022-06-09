from flask import Flask, jsonify, request
import json
import os
from pathlib import Path
import csv
import os, sys
sys.path.append(os.getcwd())
import config as appConf
import pandas as pd
from sklearn.model_selection import train_test_split

app = Flask(__name__)


@app.route('/hello', methods=['GET'])
def helloworld():
	if(request.method == 'GET'):
		data = {"data": "Hello World"}
		return jsonify(data)

@app.route('/csvupload', methods=["GET", "POST"])
def csvupload():
	data = []
	if(request.method == 'POST'):
		if request.files:
			uploaded_file = request.files['filename'] # This line uses the same variable and worked fine
			current_directory = Path.cwd()
			print(current_directory.parent)
			filepath = os.path.join(app.config['FILE_UPLOADS'], uploaded_file.filename)
			if uploaded_file.filename != '':
				uploaded_file.save(filepath)
				return jsonify("{msg:'File upload successful!!'}")
			else:
				return jsonify("{msg:'Something wrong. Please upload file again!!'}")
		else:
			return jsonify("{msg:'Something wrong. Please upload file again!!'}")
	else:
		return jsonify("{msg:'Something wrong. Please upload file again!!'}")

@app.route('/split', methods=["POST"])
def split():
	input = json.loads(request.data)
	print(request.data)
	print(input)
	if input.testSize > 0:
		raw_data = pd.read_csv("C:/Thiru workspace/Fraunhofer IPT/WS/Backend/Datasets/input_dataset.csv", na_values=["na"])
		raw_data['class'] = (raw_data['class'] == 'pos').astype('int')

    	# Pop labels
		y_raw = raw_data.pop('class')
		
		X_train, X_test, y_train, y_test = train_test_split(raw_data, y_raw, test_size=input["testSize"], random_state=0,
                                                        shuffle=True)
		return jsonify("msg:splitsuccess")
	return jsonify("msg:unable to split, kindly try again")

app.config['FILE_UPLOADS'] = appConf.datasetFolderLocation

if __name__ == '__main__':
	app.run(host=appConf.hostName,port=appConf.portForUpload,debug=True)
