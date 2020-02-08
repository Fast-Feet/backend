import CancellationMail from "../../lib/CancellationMail";

class CancellationOrderMail {
  get key() {
    return "CancellationOrderMail";
  }

  async handle({ data }) {
    console.log(data);
    await CancellationMail.sendMail(data);
  }
}

export default new CancellationOrderMail();
