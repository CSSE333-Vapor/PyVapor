import db

from flask import Flask, render_template, url_for, request, json, jsonify


abc = db.get_specific_game_by_user(3,2)
print(abc)
