import db

from flask import Flask, render_template, url_for, request, json, jsonify

abc = db.sign_in('abc1')
print(abc['salt'])