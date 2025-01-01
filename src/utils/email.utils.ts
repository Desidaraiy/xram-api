import nodemailer, { Transporter } from "nodemailer";
import User from "../models/user.model";
import Order from "../models/order.model";
import GoodInOrder from "../interfaces/goodinorder.interface";
import PushNotificationService from "./push.utils";
import deviceRepository from "../repositories/device.repository";

class EmailService {
  private static instance: EmailService;
  private transporter: Transporter;

  private constructor() {
    this.transporter = nodemailer.createTransport({
      host: "mail.vratarnitca.ru",
      port: 587,
      secure: false,
      requireTLS: true,
      tls: { rejectUnauthorized: false },
      dkim: {
        domainName: "vratarnitca.ru",
        keySelector: "dkim",
        privateKey:
          "-----BEGIN PRIVATE KEY-----\nMIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDZWKikM3XCRMQ2JzvUVqMTcPHCa9H8R0aYW7TN8R9Y4Q2r+Pmi67GkyJjMndnfX/GODfB4UERmUEIbgs40XmP/nfSTMoKfgmvH0IJzoqgAe+Mbt0YoZ05uFn5KjSaAszAUn3Xy6e4vlj/GTqwK7y6euDES4zSJ5ourMp0lSSkTHwIDAQAB\n-----END PRIVATE KEY-----",
      },
      auth: {
        user: "order@vratarnitca.ru",
        pass: "3s0Z1dPBEeKyvHon",
      },
    });
  }

  public static getInstance(): EmailService {
    if (!this.instance) {
      this.instance = new EmailService();
    }
    return this.instance;
  }

  private getTableWithGoods(order: Order): string {
    let table = `
    <table border="1">
      <tr>
        <th>Наименование</th>
        <th>Цена</th>
        <th>Количество</th>
        <th>Комментарий</th>
        <th>Сумма</th>
      </tr>
    `;
    let sum = 0;
    let orderBody = JSON.parse(order.body);
    orderBody.forEach((item: GoodInOrder) => {
      sum += item.good.price * item.quantity;
      table += `
        <tr>
          <td>${item.good.title}</td>
          <td>${item.good.price}</td>
          <td>${item.quantity}</td>
          <td>${item.comment ?? "Отсутствует"}</td>
          <td>${item.good.price * item.quantity}</td>
        </tr>
      `;
    });
    if (order.candlesComment != null && order.candlesComment != "") {
      table += `
        <tr>
          <td>Комментарий к свечам</td>
          <td></td>
          <td></td>
          <td>${order.candlesComment}</td>
          <td></td>
        </tr>
      `;
    }
    if (order.notesComment != null && order.notesComment != "") {
      table += `
        <tr>
          <td>Комментарий к запискам</td>
          <td></td>
          <td></td>
          <td>${order.notesComment}</td>
          <td></td>
        </tr>
      `;
    }
    table += `
      <tr>
        <td>Итого</td>
        <td></td>
        <td></td>
        <td></td>
        <td>${sum}</td>
      </tr>
    </table>
    `;
    return table;
  }

  public sendAdminEmail(user: User, order: Order): void {
    const letter = `
    <h1>Добрый день! Заказ с сайта vratarnitca.ru:</h1>
    <p>Заказ #${order.id} принят. </p>
    <p>Пользователь ${user.name} (${user.email})</p> 
    <p>Телефон: ${user.phone ?? "Отсутствует"}</p> 
    <p>Комментарий: ${order.comment ?? "Отсутствует"}</p>
    <p>Заказ:</p>
    ${this.getTableWithGoods(order)}
    `;
    this.transporter.sendMail(
      {
        from: "Вратарница <order@vratarnitca.ru>",
        to: "info@vratarnitca.ru",
        subject: "Уведомление о новом заказе",
        html: letter,
      },
      (error, info) => {
        if (error) {
          console.error("Error sending email:", error);
        } else {
          console.log("Email sent:", info.response);
        }
      }
    );
  }

  public sendUserEmail(user: User, order: Order): void {
    console.log("user email", user.email);
    const letter = `
    <h1>Добрый день! Спасибо за заказ на vratarnitca.ru!</h1>
    <p>Заказ #${order.id} принят. </p>
    <p>Пользователь ${user.name} (${user.email})</p> 
    <p>Телефон: ${user.phone ?? "Отсутствует"}</p> 
    <p>Комментарий: ${order.comment ?? "Отсутствует"}</p>
    <p>Заказ:</p>
    ${this.getTableWithGoods(order)}
    `;
    this.transporter.sendMail(
      {
        from: "Вратарница <order@vratarnitca.ru>",
        to: user.email,
        subject: "Спасибо за заказ!",
        html: letter,
      },
      (error, info) => {
        if (error) {
          console.error("Error sending email:", error);
        } else {
          console.log("Email sent:", info.response);
        }
      }
    );
  }

  public sendPasswordRecovery(user: User): void {
    const letter = `
    <h1>Восстановление пароля</h1>
    <p>Вы запросили восстановление пароля. </p>
    <p>Для восстановления пароля перейдите по ссылке:</p>
    <a href="https://vratarnitca.ru/change-password?code=${user.confirmationCode}">https://vratarnitca.ru/change-password?code=${user.confirmationCode}</a>
    `;
    this.transporter.sendMail(
      {
        from: "Вратарница <order@vratarnitca.ru>",
        to: user.email,
        subject: "Восстановление пароля",
        html: letter,
      },
      (error, info) => {
        if (error) {
          console.error("Error sending email:", error);
        } else {
          console.log("Email sent:", info.response);
        }
      }
    );
  }

  public sendConfirmationEmail(user: User): void {
    const letter = `
    <h1>Подтверждение почты</h1>
    <p>Для подтверждения почты перейдите по ссылке:</p>
    <a href="https://vratarnitca.ru/email-verification?code=${user.confirmationCode}">https://vratarnitca.ru/email-verification?code=${user.confirmationCode}</a>
    `;
    this.transporter.sendMail(
      {
        from: "Вратарница <order@vratarnitca.ru>",
        to: user.email,
        subject: "Подтверждение почты",
        html: letter,
      },
      (error, info) => {
        if (error) {
          console.error("Error sending email:", error);
        } else {
          console.log("Email sent:", info.response);
        }
      }
    );
  }

  public async sendSorokoustEmail(user: User): Promise<void> {
    const letter = `
    <h1>Добрый день! Уведомление с сайта vratarnitca.ru:</h1>
    <p>38 дней назад вы заказали сорокоуст, вы можете продлить поминовение по ссылке: </p>
    <a href="https://vratarnitca.ru/note">https://vratarnitca.ru/note</a>
    `;
    this.transporter.sendMail(
      {
        from: "Вратарница <order@vratarnitca.ru>",
        to: user.email,
        subject: "Уведомление",
        html: letter,
      },
      (error, info) => {
        if (error) {
          console.error("Error sending email:", error);
        } else {
          console.log("Email sent:", info.response);
        }
      }
    );

    const devices = await deviceRepository.findByUserId(user.id);
    for (const device of devices) {
      if (device.pushId !== null && device.pushId !== "") {
        PushNotificationService.getInstance().sendPushNotification(
          device.pushId!,
          "38 дней назад вы заказали сорокоуст, вы можете продлить поминовение по ссылке: https://vratarnitca.ru/note"
        );
      }
    }
    // if (user.pushId !== null && user.pushId !== "") {
    //   PushNotificationService.getInstance().sendPushNotification(
    //     user.pushId!,
    //     "38 дней назад вы заказали сорокоуст, вы можете продлить поминовение по ссылке: https://vratarnitca.ru/note"
    //   );
    // }
  }
}

export default EmailService;
