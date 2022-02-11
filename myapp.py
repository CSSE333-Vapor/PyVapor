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


app = Flask(__name__)
# 设置编码
app.config['JSON_AS_ASCII'] = False


@app.route('/', methods=['GET', 'POST'])
@cross_origin()
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
            uid = db.add_user(username, password)
            status = 0
            msg = "Success"
            response = jsonify({'status': status, 'msg': msg, 'uid': uid})
        return response
    except (KeyError, TypeError):
        status = -1
        msg = "Error: Wrong Parameter!"
        response = jsonify({'status': status, 'msg': msg})
        return response
    except ValueError as e:
        status = 2
        msg = str(e)
        response = jsonify({'status': status, 'msg': msg})
        return response


@app.route('/getSalt', methods=['GET', 'POST'])
@cross_origin()
def get_salt():
    data = request.get_json()
    try:
        username = data['username']
        print(username)
        if username == '':
            status = 1
            msg = "Error: Username Can't be NULL"
            response = jsonify({'status': status, 'msg': msg})
        else:
            result = db.sign_in(username)['salt']
            status = 0
            msg = "Success"
            response = jsonify({'status': status, 'msg': msg, 'salt': result})
        return response
    except (KeyError, TypeError) as e:
        status = 2
        msg = str(e)
        response = jsonify({'status': status, 'msg': msg})
        return response


@app.route('/login', methods=['GET', 'POST'])
@cross_origin()
def sign_in():
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
            result = db.sign_in(username)
            # print(result['hash'])
            # print(password)
            # print(result['uid'])
            if password == result['hash']:
                status = 0
                msg = "Success"
                response = jsonify({'status': status, 'msg': msg, 'uid': result['uid']})
            else:
                status = 2
                msg = "Login Failed"
                response = jsonify({'status': status, 'msg': msg})
        return response
    except (KeyError, TypeError):
        status = -1
        msg = "Error: Wrong Parameter!"
        response = jsonify({'status': status, 'msg': msg})
        return response
    except ValueError as e:
        status = -1
        msg = str(e)
        response = jsonify({'status': status, 'msg': msg})
        return response


@app.route('/createGame', methods=['GET', 'POST'])
@cross_origin()
def add_game():  # 添加游戏
    data = request.get_json()
    try:
        name = data['name']
        description = data['description']
        version = data['version']
        download = data['download']
        price = data['price']
        release_date = data['releaseDate']
        if name == '' or release_date == '' or price == '' or description == '' or download == '' or version == '':  # 非空检查
            status = 1
            msg = "Error: None of the input Can be NULL"
            response = jsonify({'status': status, 'msg': msg})
        else:
            result = db.add_game(name, description, version, download, price, release_date)
            status = 0
            msg = "Add game successfully"
            response = jsonify({'status': status, 'msg': msg, 'gid': result})
        return response
    except KeyError:
        status = -1
        msg = "Error: Wrong Parameter!"
        response = jsonify({'status': status, 'msg': msg})
        return response
    except ValueError as e:
        status = -1
        msg = str(e)
        response = jsonify({'status': status, 'msg': msg})
        return response


@app.route('/getAllGames', methods=['GET', 'POST'])
@cross_origin()
def get_all_game():
    data = request.get_json()
    try:
        page_num = data['pageNum']
        max_num = data['maxNum']
        result = db.get_all_games(page_num, max_num)
        status = 0
        msg = "Success"
        response = jsonify({'status': status, 'msg': msg, 'games': result})
        return response
    except (KeyError, TypeError):
        status = -1
        msg = "Error: Wrong Parameter!"
        response = jsonify({'status': status, 'msg': msg})
        return response
    except ValueError as e:
        status = 1
        msg = str(e)
        response = jsonify({'status': status, 'msg': msg})
        return response


@app.route('/deleteGame', methods=['GET', 'POST'])
@cross_origin()
def delete_game():
    data = request.get_json()
    try:
        gid = data['gid']
        if gid == '':  # 非空检查
            status = 2
            msg = "Error: game ID Cannot be NULL"
            response = jsonify({'status': status, 'msg': msg})
        else:
            result = db.delete_game(gid)
            print(result)
            if result == 0:
                status = 0
                msg = "Success delete game"
                response = jsonify({'status': status, 'msg': msg})
            else:
                status = 1
                msg = "failed delete game "
                response = jsonify({'status': status, 'msg': msg})
        return response
    except KeyError:
        status = -1
        msg = "Error: Wrong Parameter!"
        response = jsonify({'status': status, 'msg': msg})
        return response
    except ValueError as e:
        status = 1
        msg = str(e)
        response = jsonify({'status': status, 'msg': msg})
        return response


@app.route('/addUserGame', methods=['GET', 'POST'])
@cross_origin()
def add_game_toUser():  # 添加游戏
    data = request.get_json()
    try:
        uID = data['uid']
        gID = data['gID']
        print(uID, gID)
        if uID == '' or gID == '':  # 非空检查
            status = 1
            msg = "Error: None of the input Can be NULL"
            response = jsonify({'status': status, 'msg': msg})
        else:
            result = db.add_UserOwnGames(uID, gID)
            if result == 0:  # 结果为0添加成功
                status = 0
                msg = "Add game to User successfully"
                response = jsonify({'status': status, 'msg': msg})
            else:
                status = 2  # 添加游戏结果为2添加失败
                msg = "Add game to User failed"
                response = jsonify({'status': status, 'msg': msg})
        return response
    except KeyError:
        status = -1
        msg = "Error: Wrong Parameter!"
        response = jsonify({'status': status, 'msg': msg})
        return response


@app.route('/addReview', methods=['GET', 'POST'])
@cross_origin()
def add_review():  # 添加游戏
    data = request.get_json()
    try:
        uID = data['uid']
        gID = data['gid']
        title = data['title']
        content = data['content']
        rating = data['rating']
        print(uID, gID, content)
        if uID == '' or gID == '' or title == '' or content == '' or rating == '':  # 非空检查
            status = 1
            msg = "Error: None of the review input Can be NULL"
            response = jsonify({'status': status, 'msg': msg})
        else:
            result = db.add_review(uID, gID, title, content, rating)
            if result != 1:  # 结果为0添加成功
                status = 0
                msg = "Add review successfully"
                response = jsonify({'status': status, 'msg': msg, 'content': result})
            else:
                status = 2  # 添加游戏结果为2添加失败
                msg = "Add review  failed"
                response = jsonify({'status': status, 'msg': msg})
        return response
    except (KeyError, TypeError) as e:
        status = -1
        msg = str(e)
        response = jsonify({'status': status, 'msg': msg})
        return response


@app.route('/deleteReview', methods=['GET', 'POST'])
@cross_origin()
def delete_review():
    data = request.get_json()
    try:
        rid = data['rid']
        if rid == '':  # 非空检查
            status = 2
            msg = "Error: uerID Cannot be NULL"
            response = jsonify({'status': status, 'msg': msg})
        else:
            result = db.delete_review(rid)
            if result == 0:
                status = 0
                msg = "Success delete review"
                response = jsonify({'status': status, 'msg': msg})
            else:
                status = 1
                msg = "failed delete review "
                response = jsonify({'status': status, 'msg': msg})
        return response
    except KeyError:
        status = -1
        msg = "Error: Wrong Parameter!"
        response = jsonify({'status': status, 'msg': msg})
        return response
    except ValueError as e:
        status = 1
        msg = str(e)
        response = jsonify({'status': status, 'msg': msg})
        return response


@app.route('/getUserReview', methods=['GET', 'POST'])
@cross_origin()
def getUserReview():
    data = request.get_json()
    uid = data['uid']
    try:
        result = db.get_user_review(uid)

        status = 0
        msg = "Success"
        response = jsonify({'status': status, 'msg': msg, 'content': result})

        return response
    except (KeyError, TypeError) as e:
        status = -1
        msg = str(e)
        response = jsonify({'status': status, 'msg': msg})
        return response


@app.route('/getUserProfile', methods=['GET', 'POST'])
@cross_origin()
def getUserProfile():
    data = request.get_json()
    uid = data['uid']
    try:
        result = db.get_user_profile(uid)

        status = 0
        msg = "Success"
        response = jsonify({'status': status, 'msg': msg, 'content': result})

        return response
    except (KeyError, TypeError) as e:
        status = -1
        msg = str(e)
        response = jsonify({'status': status, 'msg': msg})
        return response


@app.route('/getSpecificReview', methods=['GET', 'POST'])
@cross_origin()
def getSpecificReview():
    data = request.get_json()
    uid = data['uid']
    gid = data['gid']
    try:
        result = db.getSpecificReview(uid, gid)

        status = 0
        msg = "Success"
        response = jsonify({'status': status, 'msg': msg, 'content': result})

        return response
    except (KeyError, TypeError) as e:
        status = -1
        msg = str(e)
        response = jsonify({'status': status, 'msg': msg})
        return response


@app.route('/updateReview', methods=['GET', 'POST'])
@cross_origin()
def update_review():  #
    data = request.get_json()
    try:
        rID = data['rid']
        title = data['title']
        content = data['content']
        rating = data['rating']
        print(rID, content)
        if rID == '':
            status = 1
            msg = "Error: review ID Cannot be NULL"
            response = jsonify({'status': status, 'msg': msg})
        else:
            result = db.update_review(rID, title, content, rating)
            if result == 0:  # 结果为0添加成功
                status = 0
                msg = "update review successfully"
                response = jsonify({'status': status, 'msg': msg})
            else:
                status = 2  # 添加游戏结果为2添加失败
                msg = "update review  failed"
                response = jsonify({'status': status, 'msg': msg})
        return response
    except (KeyError, TypeError) as e:
        status = -1
        msg = str(e)
        response = jsonify({'status': status, 'msg': msg})
        return response


@app.route('/updateUserProfile', methods=['GET', 'POST'])
@cross_origin()
def update_user_profile():  #
    data = request.get_json()
    try:
        uid= data['uid']
        address = data['address']
        email = data['email']
        phone = data['phone']
        role = data['role']

        if uid == '' :
            status = 1
            msg = "Error: UserID Cannot be NULL"
            response = jsonify({'status': status, 'msg': msg})
        else:
            result = db.update_user_Profile(uid,address,email,phone,role)
            if result == 0:  # 结果为0添加成功
                status = 0
                msg = "update user profile successfully"
                response = jsonify({'status': status, 'msg': msg})
            else:
                status = 2  # 添加游戏结果为2添加失败
                msg = "update review  failed"
                response = jsonify({'status': status, 'msg': msg})
        return response
    except (KeyError, TypeError) as e:
        status = -1
        msg = str(e)
        response = jsonify({'status': status, 'msg': msg})
        return response



@app.route('/getUserGames', methods=['GET', 'POST'])
@cross_origin()
def getUserGame():
    data = request.get_json()
    uid = data['uid']
    try:
        result = db.getUsersGames(uid)
        if result != 1:
            status = 0
            msg = "Success"
            response = jsonify({'status': status, 'msg': msg, 'content': result})

        else:
            status = 1
            msg = "failed to get user's game"
            response = jsonify({'status': status, 'msg': msg})
        return response
    except KeyError:
        status = -1
        msg = "Error: Wrong Parameter!"
        response = jsonify({'status': status, 'msg': msg})
        return response


@app.route('/addUserOwnGame', methods=['GET', 'POST'])
@cross_origin()
def addUserOwnGame():  # 添加游戏
    data = request.get_json()
    try:
        uID = data['uid']
        gID = data['gid']

        if uID == '' or gID == '':  # 非空检查
            status = 1
            msg = "Error: None of the review input Can be NULL"
            response = jsonify({'status': status, 'msg': msg})
        else:
            result = db.add_UserOwnGames(uID, gID)
            if result == 0:  # 结果为0添加成功
                status = 0
                msg = "purchase game successfully"
                response = jsonify({'status': status, 'msg': msg, 'content': result})
            else:
                status = 2  # 添加游戏结果为2添加失败
                msg = "purchase game failed"
                response = jsonify({'status': status, 'msg': msg})
        return response
    except (KeyError, TypeError) as e:
        status = -1
        msg = str(e)
        response = jsonify({'status': status, 'msg': msg})
        return response


@app.route('/deleteUserGame', methods=['GET', 'POST'])
@cross_origin()
def deleteUserGame():
    data = request.get_json()
    try:
        uid = data['uid']
        gid = data['gid']

        if uid == '' or gid == '':  # 非空检查
            status = 2
            msg = "Error: input Cannot be NULL"
            response = jsonify({'status': status, 'msg': msg})
        else:
            result = db.deleteUserGame(uid, gid)
            if result == 0:
                status = 0
                msg = "Success delete user game"
                response = jsonify({'status': status, 'msg': msg})
            else:
                status = 1
                msg = "failed delete user game "
                response = jsonify({'status': status, 'msg': msg})
        return response
    except KeyError:
        status = -1
        msg = "Error: Wrong Parameter!"
        response = jsonify({'status': status, 'msg': msg})
        return response
    except ValueError as e:
        status = 1
        msg = str(e)
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
