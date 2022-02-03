"""
@ coding: utf-8
@ Project :
@ Author: Zeen Wang
@ Date ：2022/1/28 11:12 AM
@ Additional:
@
"""
from flask import Flask, render_template, url_for, request, json, jsonify
from flask_cors import cross_origin

import db
import vapor

app = Flask(__name__)
# 设置编码
app.config['JSON_AS_ASCII'] = False


@app.route('/', methods=['GET', 'POST'])
def hello_world():
    # data0 = request.get_json()
    # print(data0)
    # #password = request.form['hash']
    # #db.add_user(username, password)
    resp = jsonify({'status': 88, 'msg': 'Test'})
    # resp.headers.add('Access-Control-Allow-Origin', '*')
    return resp


# 接收参数，并返回json数据
@app.route('/signUp', methods=['GET', 'POST'])
@cross_origin()
def sign_up():
    data = request.get_json()
    try:
        username = data['username']
        password = data['hash']
        print(username, password)
        if username == '' or password == '':
            status = 1
            msg = "Error: Username or Hash Can't be NULL"
            response = jsonify({'status': status, 'msg': msg})
        else:
            db.add_user(username, password)
            status = 0
            msg = "Success"
            response = jsonify({'status': status, 'msg': msg})
        return response
    except KeyError:
        status = -1
        msg = "Error: Wrong Parameter!"
        response = jsonify({'status': status, 'msg': msg})
        return response


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


# generate_word()
if __name__ == '__main__':
    app.run(host='127.0.0.1', port=8080)
