using System.Data;
using System.Data.SqlClient;

namespace DataAccessLayer
{
    public class TransfersDataAccessLayer
    {
        public static int GetTotalTransfers()
        {
            var total = 0;

            SqlConnection connection = new SqlConnection(ClsDataAccessSettings.ConnectionString);

            var query = @"SELECT Count(1) From Transfers;";

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
        
        public static DataTable GetAllTransfers()
        {
            SqlConnection connection = new SqlConnection(ClsDataAccessSettings.ConnectionString);

            string query =
                @"    Select     TransferID ,
                              'From'=IIF(P.FirstName is Null,'-',P.FirstName +' '+P.LastName ),
		                      'To'=IIF(P2.FirstName is Null,'-',P2.FirstName +' '+P2.LastName ),
		                      amount , TransferDate 
		                      From Transfers T
                    Left Join Clients C On C.ClientID = T.FromClientID 
                    Left Join Clients C2 On  C2.ClientID = T.ToClientID 
                    Left Join People P ON C.PersonID = P.PersonID
                    Left Join People P2 On C2.PersonID = P2.PersonID
                    Order By TransferDate Desc";

            DataTable dt = new DataTable();

            SqlCommand command = new SqlCommand(query, connection);

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
        
        public static int AddNewTransfer(int fromClientId, int toClientId,
            decimal amount, DateTime transferDate, int byUserId)
        {
            int Id = 0;
            SqlConnection connection = new SqlConnection(ClsDataAccessSettings.ConnectionString);

            string query = @"INSERT INTO Transfers
                             VALUES (@fromClientId,@toClientId,@amount,@transferDate,@byUserId)
                             SELECT SCOPE_IDENTITY();";

            SqlCommand command = new SqlCommand(query, connection);

            command.Parameters.AddWithValue("@fromClientId", fromClientId);
            command.Parameters.AddWithValue("@toClientId", toClientId);
            command.Parameters.AddWithValue("@amount", amount);
            command.Parameters.AddWithValue("@transferDate", transferDate);
            command.Parameters.AddWithValue("@byUserId", byUserId);
            try
            {
                connection.Open();
                var result = command.ExecuteScalar();

                if (result != null && int.TryParse(result.ToString(), out int insertedID))
                {
                    Id = insertedID;
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

            return Id;
        }
    }
}