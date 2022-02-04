import db

from flask import Flask, render_template, url_for, request, json, jsonify

abc = db.get_AllGames()
print(jsonify(abc))