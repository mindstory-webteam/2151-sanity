import GetQuoteForm from '@/component/GetQuoteForm';

export default function GetQuotePage() {
  return (
    <main style={{ maxWidth: 700, margin: '0 auto', padding: '40px 20px' }}>
      <h1 style={{ fontSize: 28, marginBottom: 24 }}>Start Your Story</h1>
      <GetQuoteForm />
    </main>
  );
}