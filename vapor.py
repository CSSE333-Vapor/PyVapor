import db

from flask import Flask, render_template, url_for, request, json, jsonify


abc = db.get_all_games_by_name('grand')
print(abc)
