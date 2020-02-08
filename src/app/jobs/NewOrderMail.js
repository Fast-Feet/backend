import NewMail from "../../lib/NewMail";

class NewOrderMail {
  get key() {
    return "NewOrderMail";
  }

  async handle({ data }) {
    await NewMail.sendMail(data);
  }
}

export default new NewOrderMail();
