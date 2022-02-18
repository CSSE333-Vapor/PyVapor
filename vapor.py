import db

from flask import Flask, render_template, url_for, request, json, jsonify


abc = db.add_billing_info(11111111,'Random',52,'2023-01-01',333)
print(abc)
