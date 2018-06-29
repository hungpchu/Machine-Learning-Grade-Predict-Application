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
#fileO = open("ml_scripts/data/" + course + "/grade.json", "w")
#fileO.write(inpgrade.to_json(orient="records"))
#fileO.close() 

#Load data
#  grade = data for training
grade = load_data("ml_scripts/data/" + course + "/full-grade.csv")
# intersect = ['Homework 1', 'Homework 2', 'Homework 3', ..]
intersect = [val for val in chosen if val in grade.columns.values]
# X = all value of ['Homework 1', 'Homework 2', 'Homework 3', ..]
# X = grade[intersect]
X = grade[intersect]
# print("X = ", X.head())
# y = Good, OK or highrisk
# y will be predct based on X
y = grade[["Grade"]].values.ravel()
y1 = []
for label in y:
	if label == "Good":
		y1.append(0)
	if label == "OK":
		y1.append(1)
	if label == "High-risk":
		y1.append(2)
#print('data = ', y1)

#Create models
models = []
models.append(sklearn.linear_model.LogisticRegression(solver='newton-cg',multi_class='multinomial')) # Logistic Regression ( supervise algo)
models.append(sklearn.naive_bayes.GaussianNB()) # Naive Bayes 
models.append(sklearn.neighbors.KNeighborsRegressor(n_neighbors=10)) # k Nearest Neighbors ( supervise algo)
models.append(svm.SVR()) # Support Vector Machine
#models.append(MLPRegressor(hidden_layer_sizes=(60,),activation='logistic',solver='lbfgs',learning_rate='adaptive',max_iter=1000,learning_rate_init=0.01,alpha=0.01)) # Neuron network
models.append(DecisionTreeRegressor()) # Decision Tree ( supervise algo)
models.append(RandomForestRegressor()) # Random Forest ( supervise algo)

chosenModels = [None]
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
#print("Predictions:", np.column_stack((nuid, predict)))
