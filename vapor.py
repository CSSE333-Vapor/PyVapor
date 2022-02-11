import db

from flask import Flask, render_template, url_for, request, json, jsonify


abc = db.update_user_Profile(1,'test2','rose2@qq.com','1919810','admin')
print(abc)
