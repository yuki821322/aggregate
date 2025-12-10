// app/user/events/[eventId]/qr/QrCodeBox.tsx
"use client";

import { QRCodeSVG } from "qrcode.react";

type Props = {
  value: string;
};

export default function QrCodeBox({ value }: Props) {
  return (
    <div>
      <QRCodeSVG value={value} size={260} includeMargin />
    </div>
  );
}
