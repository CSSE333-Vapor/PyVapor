"""
@ coding: utf-8
@ Project :
@ Author: Zeen Wang
@ Date ：2022/1/28 11:12 AM
@ Additional:
@
"""
from flask import Flask
import vapor

app = Flask(__name__)
#设置编码
app.config['JSON_AS_ASCII'] = False


@app.route('/')
def hello_world():
    return 'Hello World!' + vapor.DB.connect() + vapor.DB.server

#接收参数，并返回json数据
@app.route('/Data', methods=['GET', 'POST'])
def form_data():
    return False

# #接收参数，并返回json数据
# @app.route('/login', methods=['POST'])
# def form_login():
#     #从request中获取表单请求的参数信息
#     print(request.form['username'])
#     print(request.form['hash'])
#     print(request.form['salt'])
#     code = str(request.form['code'])
#     encrypted_data = str(request.form['encryptedData'])
#     iv= str(request.form['iv'])
#     return False

# #接收参数，并返回json数据
# @app.route('/phoneNum', methods=['POST'])
# def get_salt():
#     #从request中获取表单请求的参数信息
#     #print
#     open_id = str(request.form['username'])
#     session_key = str(request.form['session_key'])
#     encrypted_data = str(request.form['encryptedData'])
#     iv= str(request.form['iv'])
#     return False

# @app.route('/myAssignments', methods=['POST'])
# def form_myAssignments():
#     #从request中获取表单请求的参数信息
#     #print(request.form['open_id'])
#     #print(request.form['session_key'])
#     #print(request.form['encryptedData'])
#     #print(request.form['iv'])
#     #open_id = str(request.form['open_id'])
#     #session_key = str(request.form['session_key'])
#     #encrypted_data = str(request.form['encryptedData'])
#     #iv= str(request.form['iv'])
#     return "Testing"
#
# @app.route('/userInfo', methods=['POST'])
# def form_userInfo():
#     open_id = str(request.form['open_id'])
#     return False


#generate_word()
if __name__ == '__main__':
    app.run(host='127.0.0.1',port=8080)

