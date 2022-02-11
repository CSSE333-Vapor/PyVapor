import db

from flask import Flask, render_template, url_for, request, json, jsonify

import myapp

abc = myapp.getUserReview(1)
print(abc)
