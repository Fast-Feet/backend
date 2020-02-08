import Mail from "../../lib/Mail";

class CancellationOrderMail {
  get key() {
    return "CancellationOrderMail";
  }

  async handle({ data }) {
    await Mail.sendMail(data);
  }
}

export default new CancellationOrderMail();
