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
    const { amount, description, phone, email, domain, repo } = req.body;

    // 👇 ENVIA PRO GIBRAPAY
    const gibraResponse = await fetch('https://gibrapay.online/api/v1/payments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GIBRAPAY_CONFIG.AUTH_TOKEN}`,
        'X-API-KEY': GIBRAPAY_CONFIG.API_KEY
      },
      body: JSON.stringify({
        amount,
        currency: "MZN",
        description,
        payer: {
          phone,
          email
        },
        meta: {
          domain,
          repo
        }
      })
    });

    const gibraData = await gibraResponse.json();

    if (gibraData.success) {
      // ✅ PAGAMENTO APROVADO — RETORNA SUCESSO PRO FRONTEND
      return res.status(200).json({
        success: true,
        message: "Pagamento aprovado. Domínio sendo configurado."
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
