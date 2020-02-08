import nodemailer from "nodemailer";

import mailConfig from "../config/mail";

class NewMail {
  constructor() {
    this.transporter = nodemailer.createTransport(mailConfig, {
      from: "Fast Fleet <noreply@fastfleet.com>",
    });
  }

  async sendMail(data) {
    const { name, email } = data.deliveryman;
    const { product } = data.order;
    const {
      name: recipient,
      address,
      number,
      address_complement,
      city,
      state,
      postal_code,
    } = data.recipient;
    this.transporter.sendMail({
      to: `${name} <${email}>`,
      subject: `New order to be delivery in ${city}, ${state}`,
      html: `
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
<h2>New Order</h2>
<hr/>
<p>Hello, ${name}!</p>
<p>This email is to let you know about a new order register for you. Below follows the order details:</p>
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
The product is already available for pick up in the Fast Fleet warehouse closest to you. Let us know if you have any problems by contacting our call center.
</p>

<p>
Best regards, <br/>
The Fast Fleet Team
</p>
<hr/>
</body>
`,
    });
  }
}

export default new NewMail();
