export const metadata = {
  title: 'Client React Next',
  description: 'Your description',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
