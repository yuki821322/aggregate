"use client";

import { QRCodeCanvas } from "qrcode.react";
import styles from "./page.module.css";

type Props = {
  value: string;
};

export default function QrCodeBox({ value }: Props) {
  return (
    <div className={styles.qrBox}>
      <QRCodeCanvas
        value={value}
        size={240}
        includeMargin={true}
      />
      <p className={styles.qrUrl}>{value}</p>
    </div>
  );
}
