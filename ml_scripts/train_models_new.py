import pandas as pd
import numpy as np
import sklearn
from sklearn import datasets, linear_model, neighbors, svm, naive_bayes
from sklearn.neural_network import MLPRegressor
from sklearn.utils import column_or_1d
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_squared_error
from sklearn.tree import DecisionTreeRegressor
from sklearn.ensemble import RandomForestRegressor
from sklearn.externals import joblib
from sklearn.neighbors import KNeighborsClassifier
from sklearn.ensemble import RandomForestClassifier, AdaBoostClassifier, GradientBoostingClassifier
from sklearn.neural_network import MLPClassifier
from sklearn.preprocessing import StandardScaler, Normalizer
import re
import sys

# function to read from csv file
def load_data(csv_path):
	# index = not use the first column as the index (row names)
    return pd.read_csv(csv_path, index_col = 0)

# function to return course from argument 2
def read_in():
	course = sys.argv[1];
	# print('course = ',course)
	return course;

def get_rmse(model, X, y):
	model.fit(X, y)
	predictions = []
	for val in model.predict(X):
		if (val < 0.5):
			predictions.append(0)
		elif (val < 1.5):
			predictions.append(1)
		else:
			predictions.append(2)
	lin_mse = mean_squared_error(y, predictions) 
	lin_rmse = np.sqrt(lin_mse)
	return lin_rmse
	
#Load input

# inpgrade = table of input data
inpgrade = load_data("public/file-storage/grade.csv")
# names = header of all column
names = list(inpgrade.columns.values)
course = read_in()

#Rename columns
for name in names:
    newName = re.sub(r"\(.*\)", "", name).strip()
    inpgrade.rename(columns = {name: newName}, inplace = True)

if (course == 'csce235'):
# drop the row of NaN
    inpgrade = inpgrade.drop(inpgrade.index[0])
#  drop the fisrt row of point 
    inpgrade = inpgrade.drop(inpgrade.index[0])

#  drop the column ID 
if ('ID' in inpgrade.columns.values):
    inpgrade = inpgrade.drop('ID', axis = 1)
#  drop the column Section
if ('Section' in inpgrade.columns.values):
    inpgrade = inpgrade.drop('Section', axis = 1)


# drop all the column of NAN
inpgrade.dropna(axis = 1, how = 'all', inplace = True)
# replace NaN value with 0
inpgrade.fillna(0, inplace = True)
inpgrade['Full name'] = inpgrade.index.values
# choose all column with type of float64 as number
chosen = inpgrade.select_dtypes(include='float64').columns.values
inpgrade1 = inpgrade[inpgrade.columns.difference(['Student', 'SIS User ID', 'SIS Login ID', 'Full name'])]
#fileO = open("ml_scripts/data/" + course + "/grade.json", "w")
#fileO.write(inpgrade.to_json(orient="records"))
#fileO.close() 

chosenModels = [None]

if ( len(inpgrade1.columns) == 2 ):
	grade = load_data("ml_scripts/data/" + course + "/MasterTrainingData1.csv")
	X = grade[['Homework 1', 'Quiz 1']].values
	y = grade[["Grade"]].values.ravel()
	y1 = []
	for label in y:
		if label == "Good":
			y1.append(0)
		if label == "OK":
			y1.append(1)
		if label == "High-risk":
			y1.append(2)
	#model = MLPClassifier(random_state=0, hidden_layer_sizes=(7, 20), alpha=0.0001, solver='lbfgs',max_iter=200, learning_rate = 'adaptive')
	model = AdaBoostClassifier(random_state=0, n_estimators=1000)
	model.fit(X, y1)
	chosenModels[0] = model
	
elif ( len(inpgrade1.columns) == 5 ):   
	grade = load_data("ml_scripts/data/" + course + "/MasterTrainingData2.csv")
	X = grade[['Quiz 1 ', 'Quiz 2 ', 'Quiz 3', 'Homework 1', 'Homework 2']].values
	y = grade[["Grade"]].values.ravel()
	y1 = []
	for label in y:
		if label == "Good":
			y1.append(0)
		if label == "OK":
			y1.append(1)
		if label == "High-risk":
			y1.append(2)
	model = MLPClassifier(random_state=0, hidden_layer_sizes=(7, 20), alpha=0.0001, solver='lbfgs',max_iter=600, learning_rate = 'adaptive')
	model.fit(X, y1)
	chosenModels[0] = model

elif ( len(inpgrade1.columns) == 9 ):
	grade = load_data("ml_scripts/data/" + course + "/MasterTrainingData3.csv")
	X = grade[['Quiz 1 ', 'Quiz 2 ', 'Quiz 3','Quiz 4 ','Quiz 5 ', 'Homework 1', 'Homework 2', 'Homework 3', 'Midterm']].values 
	y = grade[["Grade"]].values.ravel()
	y1 = []
	for label in y:
		if label == "Good":
			y1.append(0)
		if label == "OK":
			y1.append(1)
		if label == "High-risk":
			y1.append(2)		   
	model = MLPClassifier(random_state=0, hidden_layer_sizes=(7, 20), alpha=0.0001, solver='lbfgs',max_iter=600, learning_rate = 'adaptive')
	model.fit(X, y1)
	chosenModels[0] = model

elif ( len(inpgrade1.columns) == 12 ): 
	grade = load_data("ml_scripts/data/" + course + "/MasterTrainingData4.csv")
	# X = grade[['Quiz 7', 'Homework 1', 'Homework 2', 'Homework 3', 'Homework 4 ', 'Midterm']].values
	X = grade[['Quiz 1 ', 'Quiz 2 ', 'Quiz 3','Quiz 4 ','Quiz 5 ','Quiz 6','Quiz 7','Homework 1', 'Homework 2', 'Homework 3', 'Homework 4 ', 'Midterm']].values
	y = grade[["Grade"]].values.ravel()
	y1 = []
	for label in y:
		if label == "Good":
			y1.append(0)
		if label == "OK":
			y1.append(1)
		if label == "High-risk":
			y1.append(2)	   
	model = MLPClassifier(random_state=0, hidden_layer_sizes=(10, 30), alpha=0.001, solver='lbfgs',max_iter=1000, learning_rate = 'adaptive')
	model.fit(X, y1)
	chosenModels[0] = model

elif ( len(inpgrade1.columns) == 4 ):
	grade = load_data("ml_scripts/data/" + course + "/MasterTrainingData1new.csv")
	#grade = load_data("ml_scripts/data/" + course + "/full-grade.csv")
	X = grade[['Lab 1 ', 'Lab 2 ', 'Lab 3 ', 'Assignment 1']].values
	y = grade[["Grade"]].values.ravel()
	y1 = []
	for label in y:
		if label == "Good":
			y1.append(0)
		if label == "OK":
			y1.append(1)
		if label == "High-risk":
			y1.append(2)
	model = MLPClassifier(random_state=0, hidden_layer_sizes=(5, 20), alpha=0.001, solver='lbfgs',max_iter=1000, learning_rate = 'adaptive')
	model.fit(X, y1)
	chosenModels[0] = model
	
elif ( len(inpgrade1.columns) == 8 ):   
	grade = load_data("ml_scripts/data/" + course + "/MasterTrainingData2new.csv")
	X = grade[['Lab 1 ', 'Lab 2 ', 'Lab 3 ', 'Lab 4 ', 'Lab 5 ', 'Lab 6', 'Assignment 1', 'Assignment 2 ']].values
	y = grade[["Grade"]].values.ravel()
	y1 = []
	for label in y:
		if label == "Good":
			y1.append(0)
		if label == "OK":
			y1.append(1)
		if label == "High-risk":
			y1.append(2)
	model = MLPClassifier(random_state=0, hidden_layer_sizes=(10, 30), alpha=0.0001, solver='lbfgs',max_iter=800, learning_rate = 'adaptive')
	model.fit(X, y1)
	chosenModels[0] = model

elif ( len(inpgrade1.columns) == 13 ):
	grade = load_data("ml_scripts/data/" + course + "/MasterTrainingData3new.csv")
	X = grade[['Lab 1 ', 'Lab 2 ', 'Lab 3 ','Lab 4 ','Lab 5 ','Lab 6','Lab 7 ','Lab 8 ','Lab 9 ', 'Assignment 1', 
			   'Assignment 2 ', 'Assignment 3 ', 'Midterm']].values
	scaler = StandardScaler().fit(X)
	X = scaler.transform(X) 
	y = grade[["Grade"]].values.ravel()
	y1 = []
	for label in y:
		if label == "Good":
			y1.append(0)
		if label == "OK":
			y1.append(1)
		if label == "High-risk":
			y1.append(2)		   
	model = MLPClassifier(random_state=0, hidden_layer_sizes=(7, 20), alpha=0.0001, solver='lbfgs',max_iter=400, learning_rate = 'adaptive')
	model.fit(X, y1)
	chosenModels[0] = model

elif ( len(inpgrade1.columns) == 17 ): 
	grade = load_data("ml_scripts/data/" + course + "/MasterTrainingData4new.csv")
	X = grade[['Lab 1 ', 'Lab 2 ', 'Lab 3 ','Lab 4 ','Lab 5 ','Lab 6','Lab 7 ','Lab 8 ','Lab 9 ', 'Lab 10 ','Lab 11 ','Lab 12 ',
           'Assignment 1', 'Assignment 2 ', 'Assignment 3 ', 'Assignment 4 ', 'Midterm']].values
	y = grade[["Grade"]].values.ravel()
	y1 = []
	for label in y:
		if label == "Good":
			y1.append(0)
		if label == "OK":
			y1.append(1)
		if label == "High-risk":
			y1.append(2)	   
	model = MLPClassifier(random_state=0, hidden_layer_sizes=(5, 20), alpha=0.001, solver='lbfgs',max_iter=1000, learning_rate = 'adaptive')
	model.fit(X, y1)
	chosenModels[0] = model



#Load data
#  grade = data for training


# intersect = ['Homework 1', 'Homework 2', 'Homework 3', ..]
# intersect = [val for val in chosen if val in grade.columns.values]
intersect = [val for val in inpgrade1]
# X = all value of ['Homework 1', 'Homework 2', 'Homework 3', ..]
# X = grade[intersect]
# print(intersect)
#X = grade[intersect]full-grade-week2new

#scaler = StandardScaler().fit(X)
#X = scaler.transform(X) 



#Create models
models = []
models.append(sklearn.linear_model.LogisticRegression(C = 59.9, penalty = 'l1')) # Logistic Regression ( supervise algo)
models.append(sklearn.naive_bayes.GaussianNB()) # Naive Bayes 
models.append(sklearn.neighbors.KNeighborsClassifier(n_neighbors = 3, p = 2)) # k Nearest Neighbors
models.append(svm.SVR()) # Support Vector Machine
models.append(MLPClassifier(random_state=0, hidden_layer_sizes=(5, 20), alpha=0.001, solver='lbfgs',max_iter=800, learning_rate = 'adaptive')) # Neuron network
models.append(DecisionTreeRegressor(max_depth = 7.742636826811269)) # Decision Tree ( supervise algo)
models.append(RandomForestClassifier(max_depth = 11, n_estimators = 3)) # Random Forest


minRMSE = float("inf")
#rmse = get_rmse(models[0], X, y1)
#rmse = get_rmse(models[1], X, y1)
#rmse = get_rmse(models[2], X, y1)
#rmse = get_rmse(models[3], X, y1)
#rmse = get_rmse(models[4], X, y1)
#rmse = get_rmse(models[5], X, y1)
#rmse = get_rmse(models[6], X, y1)
for model in models:
	# rmse = sai số  
	rmse = get_rmse(model, X, y1)
	if rmse < minRMSE:
		minRMSE = rmse
		chosenModels[0] = model
# chosenModels = SRV() -> sai số nhỏ nhất = 0.0
lr_pred = []
nb_pred = []

for val in models[0].predict(X):
	if (val < 0.5):
		lr_pred.append(0)
	elif (val < 1.5):
		lr_pred.append(1)
	else:
		lr_pred.append(2)

for val in models[1].predict(X):
	if (val < 0.5):
		nb_pred.append(0)
	elif (val < 1.5):
		nb_pred.append(1)
	else:
		nb_pred.append(2)

lrnb_pred = []
# Find max value between lr_pred and nb_pred -> put it in lrnb_pred
for i in range(len(lr_pred)):
	lrnb_pred.append(max(lr_pred[i], nb_pred[i]))
#  minRMSE = 0 not go to this loop
mse = mean_squared_error(y1, lrnb_pred) 
rmse = np.sqrt(mse)
if (rmse <= minRMSE):
	chosenModels[0] = models[0]
	chosenModels.append(models[1])

    
#models[4].fit(X, y1)
#chosenModels[0] = models[4]





#Export models in the file
# chosenModels = SVR for 0,1,2 and Logistic for 10,8,2
for i in range(len(chosenModels)):
	joblib.dump(chosenModels[i], 'ml_scripts/models/' + course + '/model' + str(i) + '.pkl')

#print(chosenModels[0].predict([[100,100,100,100,10,10,10,10,30,10]]))

res = str(len(chosenModels)) + ";"
#res = ""
for feature in intersect:
	res += feature + ","
res = res[:-1] + ";"
res += inpgrade.to_json(orient="records")
print(res, end='', flush=True)

# print = 
# 1;Homework 1,Homework 2,Homework 3,Homework 4,Quiz 1,Quiz 2,Quiz 3,Quiz 4,Midterm,Quiz 5;
# [{"SIS User ID":50018756.0,"SIS Login ID":"madamec2","Homework 1":98.0,"Homework 2":101.0,"Homework 3":106.5,
# "Homework 4":0.0,"Quiz 1":9.5,"Quiz 2":10.0,"Quiz 3":9.0,"Quiz 4":10.0,"Midterm":35.0,"Quiz 5":8.0,"Assignments Current Points":"387",
# "Assignments Final Points":"387","Assignments Current Score":"100.52","Assignments Final Score":"79.63","Current Points":"387",
# "Final Points":"387","Current Score":"100.52","Final Score":"79.63","Full name":"Matous Adamec"},{"SIS User ID":8558403.0,
# "SIS Login ID":"aalawfi2","Homework 1":55.0,"Homework 2":0.0,"Homework 3":0.0,"Homework 4":0.0,"Quiz 1":7.0,"Quiz 2":0.0,
# "Quiz 3":0.0,"Quiz 4":0.0,"Midterm":0.0,"Quiz 5":0.0,"Assignments Current Points":"62","Assignments Final Points":"62",
# "Assignments Current Score":"21.75","Assignments Final Score":"12.76","Current Points":"62","Final Points":"62",
# "Current Score":"21.75","Final Score":"12.76","Full name":"Abdullah Al Awfi"}]


#Testing
#some_rows = inpgrade
#some_data = some_rows[intersect]
#lr_predict = lr_model.predict(some_data)
#nb_predict = nb_model.predict(some_data)
#predict = [""] * len(lr_predict)
#for i in range(len(lr_predict)):
#    if (lr_predict[i] == "High-risk" or nb_predict[i] == "High-risk"):
#        predict[i] = "High-risk"
#    elif (lr_predict[i] == "OK" or nb_predict[i] == "OK"):
#        predict[i] = "OK"
#    else:
#        predict[i] = "Good"
#print("Data:", some_data)
#nuid = list(map(int, inpgrade['SIS User ID'].values))
© 2019 GitHub, Inc.
Terms
Privacy
Security
Status
Help
Contact GitHub
Pricing
API
Training
Blog
About
Press h to open a hovercard with more details.