using System.Data;
using System.Data.SqlClient;

namespace DataAccessLayer
{
    public static class CurrenciesDataAccessLayer
    {
        public static int GetTotalCurrencies()
        {
            var total = 0;

            SqlConnection connection = new SqlConnection(ClsDataAccessSettings.ConnectionString);

            var query = @"SELECT Count(1) From Currencies;";

            SqlCommand command = new SqlCommand(query, connection);

            try
            {
                connection.Open();
                var result = command.ExecuteScalar();

                if (result != null && int.TryParse(result.ToString(), out var insertedId))
                {
                    total = insertedId;
                }
            }
            catch (Exception ex)
            {
                //.Show("Error: " + ex.Message);
            }
            finally
            {
                connection.Close();
            }

            return total;
        }

        public static DataTable GetAllCurrencies()
        {
            SqlConnection connection = new SqlConnection(ClsDataAccessSettings.ConnectionString);

            string Query = @"Select 'ID'=CurrencyID , 'Code'=CurrencyCode,
                                    'Name' =CurrencyName ,Rate   From Currencies;";

            DataTable dt = new DataTable();

            SqlCommand command = new SqlCommand(Query, connection);

            try
            {
                connection.Open();
                SqlDataReader reader = command.ExecuteReader();

                if (reader.HasRows)
                {
                    dt.Load(reader);
                }

                reader.Close();
            }
            catch (Exception e)
            {
                //.Show(e.ToString());
            }
            finally
            {
                connection.Close();
            }

            return dt;
        }

        public static bool GetCurrencyById(int id, ref string currencyCode, ref string currencyName, ref decimal rate)
        {
            bool isFound = false;

            SqlConnection connection = new SqlConnection(ClsDataAccessSettings.ConnectionString);

            string query = "Select * from Currencies Where CurrencyID=@ID";

            SqlCommand command = new SqlCommand(query, connection);
            command.Parameters.AddWithValue("@ID", id);

            try
            {
                connection.Open();
                SqlDataReader reader = command.ExecuteReader();
                if (reader.Read())
                {
                    isFound = true;
                    currencyCode = Convert.ToString(reader[1]);
                    currencyName = Convert.ToString(reader[2]);
                    rate = Convert.ToDecimal(reader[3]);
                }
            }
            catch (Exception e)
            {
                //.Show(e.ToString());
                isFound = false;
            }
            finally
            {
                connection.Close();
            }

            return isFound;
        }
    }
}