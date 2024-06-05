using System.Data;
using DataAccessLayer;

namespace BusinessLayer
{
    public class CurrenciesBusinessLayer
    {
        public int CurrencyId { get; set; }
        public string CurrencyCode { get; set; }
        public string CurrencyName { get; set; }
        public decimal Rate { get; set; }

        private CurrenciesBusinessLayer(int currencyId, string currencyCode, string currencyName, decimal rate)
        {
            CurrencyId = currencyId;
            CurrencyCode = currencyCode;
            CurrencyName = currencyName;
            Rate = rate;
        }

        public static int GetTotalCurrencies()
        {
            return CurrenciesDataAccessLayer.GetTotalCurrencies();
        }

        public static DataTable GetAllCurrencies()
        {
            return CurrenciesDataAccessLayer.GetAllCurrencies();
        }

        public static CurrenciesBusinessLayer? FindCurrency(int id)
        {
            string currencyCode = "", currencyName = "";
            decimal rate = 0;

            if (CurrenciesDataAccessLayer.GetCurrencyById(id, ref currencyCode, ref currencyName, ref rate))
                return new CurrenciesBusinessLayer(id, currencyCode, currencyName, rate);

            return null;
        }

    }
}