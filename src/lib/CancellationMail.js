import nodemailer from "nodemailer";

import mailConfig from "../config/mail";

class CancellationMail {
  constructor() {
    this.transporter = nodemailer.createTransport(mailConfig, {
      from: "Fast Fleet <noreply@fastfleet.com>",
    });
  }

  async sendMail(data) {
    const { product, id: order_id } = data.order;
    const { name, email } = data.order.deliveryman;
    const { description } = data.delivery_problem;
    const {
      name: recipient,
      address,
      number,
      address_complement,
      city,
      state,
      postal_code,
    } = data.order.recipient;
    this.transporter.sendMail({
      to: `${name} <${email}>`,
      subject: `Cancellation of delivery #${order_id}`,
      html: `
<html>
<head>
<style>
  table {
    margin: 0 auto;
  }
  th {
    text-align: right;
    color: #333;
  }
  td {
    text-align: left;
    color: #666;
  }
</style>
</head>
<body>
<h2>Cancellation of Order</h2>
<hr/>
<p>Dear ${name},</p>
<p>The order #${order_id} was cancelled due to the following reason: "${description}."</p>
<p> Below follows the order details:</p>
<table>
  <tr>
    <th>Product</th>
    <td>${product}</td>
  </tr>
  <tr>
    <th>Name</th>
    <td>${recipient}</td>
  </tr>
  <tr>
    <th>Address</th>
    <td>${address}</td>
  </tr>
  ${number !== null ? `<tr><th>Number</th><td>${number}</td></tr>` : ""}
  ${
    address_complement !== null
      ? `<tr><th>Address Complement</th><td>${address_complement}</td></tr>`
      : ""
  }
  <tr>
    <th>Postal Code</th>
    <td>${postal_code}</td>
  </tr>
  <tr>
    <th>City</th>
    <td>${city}</td>
  </tr>
  <tr>
    <th>State</th>
    <td>${state}</td>
  </tr>
  <tr></tr>
  <tr></tr>
</table>

<p>
Sorry for any inconvinience. Let us know if you have any questions.
</p>

<p>
Best regards, <br/>
The Fast Fleet Team
</p>
<hr/>
</body>
</html>
`,
    });
  }
}

export default new CancellationMail();
