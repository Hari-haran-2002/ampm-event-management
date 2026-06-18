from flask import Flask, render_template, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from dotenv import load_dotenv
from datetime import datetime
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
import os
import threading

load_dotenv()

app = Flask(__name__)

# ── DATABASE ──────────────────────────────────────────────────
db_url = os.environ.get("DATABASE_URL") or os.environ.get("LOCAL_DB")
if db_url and db_url.startswith("mysql://"):
    db_url = db_url.replace("mysql://", "mysql+pymysql://", 1)
elif db_url and db_url.startswith("postgres://"):
    db_url = db_url.replace("postgres://", "postgresql://", 1)
app.config['SQLALCHEMY_DATABASE_URI'] = db_url
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

# ── EMAIL CONFIG ──────────────────────────────────────────────
SENDER_EMAIL    = os.environ.get("SENDER_EMAIL")
SENDER_PASSWORD = os.environ.get("SENDER_PASSWORD")
OWNER_EMAIL     = os.environ.get("OWNER_EMAIL")

# ── MODEL ─────────────────────────────────────────────────────
class Enquiry(db.Model):
    id         = db.Column(db.Integer, primary_key=True)
    name       = db.Column(db.String(100), nullable=False)
    mobile     = db.Column(db.String(20),  nullable=False)
    email      = db.Column(db.String(120), nullable=True)
    event_type = db.Column(db.String(50),  nullable=True)
    event_date = db.Column(db.String(20),  nullable=True)
    guests     = db.Column(db.String(20),  nullable=True)
    message    = db.Column(db.Text,        nullable=True)
    created_at = db.Column(db.DateTime,    default=datetime.utcnow)

# ── EMAIL: Alert to Rohith ────────────────────────────────────
def send_alert_to_owner(data):
    print(f">>> Sending alert to: {OWNER_EMAIL}")
    print(f">>> From: {SENDER_EMAIL}")
    print(f">>> Password loaded: {bool(SENDER_PASSWORD)}")
    msg = MIMEMultipart('alternative')
    msg['Subject'] = f"New Enquiry from {data['name']} - AMPM Website"
    msg['From']    = SENDER_EMAIL
    msg['To']      = OWNER_EMAIL
    html = f"""
    <html><body style="font-family:Arial,sans-serif;background:#f0f0f0;padding:30px;">
      <div style="max-width:560px;margin:auto;background:#fff;border-radius:14px;overflow:hidden;">
        <div style="background:#012219;padding:24px;text-align:center;">
          <h2 style="color:#d4af37;margin:0;">New Client Enquiry!</h2>
        </div>
        <div style="padding:30px;">
          <table style="width:100%;font-size:0.95rem;">
            <tr><td style="padding:10px 0;color:#888;width:35%;">Name</td><td><strong>{data['name']}</strong></td></tr>
            <tr><td style="padding:10px 0;color:#888;">Mobile</td><td><strong>{data['mobile']}</strong></td></tr>
            <tr><td style="padding:10px 0;color:#888;">Email</td><td>{data['email'] or '—'}</td></tr>
            <tr><td style="padding:10px 0;color:#888;">Event Type</td><td>{data['event_type'] or '—'}</td></tr>
            <tr><td style="padding:10px 0;color:#888;">Event Date</td><td>{data['event_date'] or '—'}</td></tr>
            <tr><td style="padding:10px 0;color:#888;">Guests</td><td>{data['guests'] or '—'}</td></tr>
            <tr><td style="padding:10px 0;color:#888;vertical-align:top;">Message</td><td>{data['message'] or '—'}</td></tr>
          </table>
        </div>
        <div style="background:#f9f6f0;padding:16px;text-align:center;">
          <p style="color:#888;font-size:0.8rem;margin:0;">Submitted on {datetime.now().strftime("%d %b %Y at %I:%M %p")}</p>
        </div>
      </div>
    </body></html>"""
    msg.attach(MIMEText(html, 'html'))
    with smtplib.SMTP_SSL('smtp.gmail.com', 465) as smtp:
        smtp.login(SENDER_EMAIL, SENDER_PASSWORD)
        smtp.sendmail(SENDER_EMAIL, OWNER_EMAIL, msg.as_string())
    print(">>> Owner alert sent successfully!")

# ── EMAIL: Thank-you to Client ────────────────────────────────
def send_confirmation_to_client(data):
    if not data['email']:
        print(">>> No client email provided, skipping.")
        return
    msg = MIMEMultipart('alternative')
    msg['Subject'] = "Thank You for Contacting AMPM Event Management!"
    msg['From']    = SENDER_EMAIL
    msg['To']      = data['email']
    html = f"""
    <html><body style="font-family:Arial,sans-serif;background:#f9f6f0;padding:30px;">
      <div style="max-width:560px;margin:auto;background:#fff;border-radius:14px;overflow:hidden;">
        <div style="background:#012219;padding:30px;text-align:center;">
          <h1 style="color:#d4af37;margin:0;">AMPM</h1>
          <p style="color:#fff;margin:6px 0 0;letter-spacing:2px;font-size:0.85rem;">EVENT MANAGEMENT &amp; CATERING SERVICES</p>
        </div>
        <div style="padding:30px;">
          <h2 style="color:#012219;">Dear {data['name']},</h2>
          <p style="color:#555;line-height:1.7;">Thank you for reaching out! We received your enquiry and will contact you within <strong>24 hours</strong>.</p>
          <div style="background:#f9f6f0;border-radius:10px;padding:20px;margin:20px 0;border-left:4px solid #d4af37;">
            <h3 style="color:#012219;margin-top:0;">Your Enquiry Summary</h3>
            <table style="width:100%;font-size:0.9rem;">
              <tr><td style="padding:6px 0;color:#888;width:40%;">Event Type</td><td><strong>{data['event_type'] or 'Not specified'}</strong></td></tr>
              <tr><td style="padding:6px 0;color:#888;">Event Date</td><td><strong>{data['event_date'] or 'Not specified'}</strong></td></tr>
              <tr><td style="padding:6px 0;color:#888;">Guests</td><td><strong>{data['guests'] or 'Not specified'}</strong></td></tr>
              <tr><td style="padding:6px 0;color:#888;">Mobile</td><td><strong>{data['mobile']}</strong></td></tr>
            </table>
          </div>
          <p style="color:#555;">For urgent inquiries call: <strong style="color:#1a3a5c;">6374330154</strong> (Rohith)</p>
        </div>
        <div style="background:#012219;padding:20px;text-align:center;">
          <p style="color:#d4af37;margin:0;font-size:0.85rem;">No.62/12, P.E. Koil Street, Ayanavaram, Chennai – 600 023</p>
        </div>
      </div>
    </body></html>"""
    msg.attach(MIMEText(html, 'html'))
    with smtplib.SMTP_SSL('smtp.gmail.com', 465) as smtp:
        smtp.login(SENDER_EMAIL, SENDER_PASSWORD)
        smtp.sendmail(SENDER_EMAIL, data['email'], msg.as_string())
    print(">>> Client confirmation sent successfully!")

# ── ROUTES ────────────────────────────────────────────────────
@app.route("/")
def index():
    return render_template("index.html")

@app.route("/submit", methods=["POST"])
def submit():
    data = {
        "name":       request.form.get("name", "").strip(),
        "mobile":     request.form.get("mobile", "").strip(),
        "email":      request.form.get("email", "").strip(),
        "event_type": request.form.get("event_type", "").strip(),
        "event_date": request.form.get("event_date", "").strip(),
        "guests":     request.form.get("guests", "").strip(),
        "message":    request.form.get("message", "").strip(),
    }

    if not data["name"] or not data["mobile"]:
        return jsonify({"success": False, "message": "Name and Mobile are required."})

    # Save to DB
    enquiry = Enquiry(**data)
    db.session.add(enquiry)
    db.session.commit()
    print(">>> Enquiry saved to DB!")

    # ── Send emails synchronously (required for Serverless) ────
    try:
        print(">>> Sending enquiry emails...")
        send_alert_to_owner(data)
        send_confirmation_to_client(data)
        print(">>> All emails sent successfully!")
    except Exception as e:
        print(f">>> Email sending error: {e}")
    # ──────────────────────────────────────────────────────────

    return jsonify({"success": True, "message": "Thank you! Check your email for confirmation."})

# ── ADMIN ─────────────────────────────────────────────────────
@app.route("/admin/enquiries")
def admin_enquiries():
    enquiries = Enquiry.query.order_by(Enquiry.created_at.desc()).all()
    rows = ""
    for e in enquiries:
        rows += f"""<tr>
          <td>{e.id}</td><td>{e.name}</td><td>{e.mobile}</td>
          <td>{e.email or '—'}</td><td>{e.event_type or '—'}</td>
          <td>{e.event_date or '—'}</td><td>{e.guests or '—'}</td>
          <td>{e.created_at.strftime('%d %b %Y %I:%M %p')}</td>
        </tr>"""
    return f"""<html><head><title>AMPM Admin</title>
    <style>
      body{{font-family:Arial;padding:30px;background:#f9f6f0}}
      h2{{color:#012219}}
      table{{width:100%;border-collapse:collapse;background:#fff;border-radius:10px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.08)}}
      th{{background:#012219;color:#d4af37;padding:14px 12px;text-align:left}}
      td{{padding:12px;border-bottom:1px solid #eee;color:#333}}
      tr:hover td{{background:#f9f6f0}}
    </style></head>
    <body>
      <h2>AMPM — All Enquiries ({len(enquiries)} total)</h2>
      <table>
        <thead><tr>
          <th>#</th><th>Name</th><th>Mobile</th><th>Email</th>
          <th>Event</th><th>Date</th><th>Guests</th><th>Submitted</th>
        </tr></thead>
        <tbody>{rows}</tbody>
      </table>
    </body></html>"""

# ── INIT ──────────────────────────────────────────────────────
with app.app_context():
    db.create_all()

if __name__ == "__main__":
    app.run(debug=True)