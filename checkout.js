// 🛑 ARQUIVO SECRETO — NUNCA EXPOEM NO FRONTEND
const GIBRAPAY_CONFIG = {
  AUTH_TOKEN: "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6ImQxMmFmYWNhLWVhNDctNGNkZS04NmJlLWJlMDM5Mzc2OTczMiIsImVtYWlsIjoienVuaWFtdW5pcjMwQGdtYWlsLmNvbSIsImlhdCI6MTc1Njk5MTk0MiwiZXhwIjoxNzU2OTk1NTQyfQ.7KFXSdhTEG1NkyyATa7sL256TUb_t2T_oqh3TVHdabc",
  WALLET_ID: "50c282d1-843f-4b9c-a287-2140e9e8d94b",
  API_KEY: "b3b33cba8a903626a015d592754f1dcec756e9fbb12d411516f4a79b04aba8923ebb6396da29e61c899154ab005aaf056961b819c263e1ec5d88c60b9cae6aba"
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: "Método não suportado" });
  }

  try {
    const { phone, amount } = req.body;

    if (!phone || !amount) {
      return res.status(400).json({ success: false, message: "Número e valor são obrigatórios." });
    }

    // 👇 , E-MAIL, ETC.
    const gibraResponse = await fetch('https://gibrapay.online/v1/transfer', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'API-Key': GIBRAPAY_CONFIG.API_KEY
      },
      body: JSON.stringify({
        wallet_id: GIBRAPAY_CONFIG.WALLET_ID,
        amount: amount,
        number_phone: phone
      })
    });

    const gibraData = await gibraResponse.json();

    if (gibraData.status === "success") {
      // ✅ PAGAMENTO APROVADO — RETORNA SUCESSO PRO FRONTEND
      return res.status(200).json({
        success: true,
        message: "Pagamento aprovado."
      });
    } else {
      // ❌ PAGAMENTO RECUSADO — RETORNA ERRO
      return res.status(402).json({
        success: false,
        message: gibraData.message || "Pagamento não aprovado."
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Erro interno ao processar pagamento."
    });
  }
}
