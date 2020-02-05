import Mail from "../../lib/Mail";

class NewOrderMail {
  get key() {
    return "NewOrderMail";
  }

  async handle({ data }) {
    await Mail.sendMail(data);
  }
}

export default new NewOrderMail();
