export default function handler(req, res) {
  res.status(200).json({ ok: true, message: "Keys will be sent to your email" });
}
