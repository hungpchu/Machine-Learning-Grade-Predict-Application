import pandas as pd
import numpy as np
import sklearn
import sys, json
from sklearn import datasets, linear_model, neighbors, svm
from sklearn.externals import joblib


def read_in():
	# print(" sys.argv[1] = ", sys.argv[1])
	rFile = open('ml_scripts/models/' + sys.argv[1] + '/params.txt', 'r')
	# rFile = open('ml_scripts/models/csce156/params.txt', 'r')	
	params = rFile.read().split(",")
	rFile.close()
	# print(" params = ", params) 	
#	result = []
#	for param in params:
#		for i in range(1, len(sys.argv)):
#			if (sys.argv[i] == param):
#				result += [float(sys.argv[i + 1])]
#				break
#	return [result]
	# print(" sys.argv[2] = " ,sys.argv[2]  )	
	# print(" sys.argv[3] = " ,sys.argv[3]  )	
	n = int(sys.argv[2])
	m = int(sys.argv[3])
	# print(" m = " ,m  )		
	j = 4
	students = []
	for i in range(n):
		cnt = 0
		student = []
		while (cnt < m):
			if sys.argv[j] in params:
				# print("j trong if =",j) 				
				# print( " student be4 = ", student  )
				student += [float(sys.argv[j + 1])]
				# print( " student after = ", student )				
			j += 2
			cnt += 1
			# print("j =",j) 
			# print("cnt =",cnt) 		
		students += [student]
	return students

		
def get_prediction(model, X):
	# print("X = ",X)
	pred = []
	for val in model.predict(X):
		if (val < 0.5):
			pred.append(0)
		elif (val < 1.5):
			pred.append(1)
		else:
			pred.append(2)
#	return pred[0]
	return pred

def main():
	X = read_in()
	# print("X = ", X)
	# print(" sys.argv[1] trong main = ", sys.argv[1])
	# rFile = open('ml_scripts/models/csce156/noOfModels.txt', 'r')	
	rFile = open('ml_scripts/models/' + sys.argv[1] + '/noOfModels.txt', 'r')
	noOfModels = int(rFile.read())
	rFile.close()
#	resnum = 0
	resnum = [0] * len(X)
	for i in range(noOfModels):
		# print(" sys.argv[1] trong loop = ", sys.argv[1])
		# model = joblib.load('ml_scripts/models/csce156/model' + str(i) + '.pkl')	
		model = joblib.load('ml_scripts/models/' + sys.argv[1] + '/model' + str(i) + '.pkl')
#		resnum = max(resnum, get_prediction(model, X))
		newPred = get_prediction(model, X)
		resnum = [max(resnum[i], newPred[i]) for i in range(len(X))]
	res = []
	for pred in resnum:
		if (pred == 0): res += ["Good"]
		elif (pred == 1): res += ["OK"]
		else: res += ["High-risk"]
#	if (resnum == 0): 
#		res = "Good"
#	elif (resnum == 1): 
#		res = "OK"
#	else: 
#		res = "High-risk"
	print(','.join(res), end='', flush=True)

if __name__ == '__main__':
	main()
