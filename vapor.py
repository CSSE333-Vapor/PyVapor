import db

from flask import Flask, render_template, url_for, request, json, jsonify

abc = db.getUsersGames(1)
print(abc)
