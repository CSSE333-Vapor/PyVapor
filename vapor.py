import db

from flask import Flask, render_template, url_for, request, json, jsonify


abc = db.get_game_review(3)
print(abc)
