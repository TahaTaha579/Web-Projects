using System.Data;
using System.Data.SqlClient;

namespace DataAccessLayer
{
    public class ClientsDataAccessLayer
    {
        public static int GetTotalClients()
        {
            var total = 0;

            SqlConnection connection = new SqlConnection(ClsDataAccessSettings.ConnectionString);

            var query = @"SELECT Count(1) From Clients;";

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
            catch (Exception)
            {
                //.Show("Error: " + ex.Message);
            }
            finally
            {
                connection.Close();
            }

            return total;
        }

        public static DataTable GetAllClients()
        {
            SqlConnection connection = new SqlConnection(ClsDataAccessSettings.ConnectionString);

            var query = @"select 'Client ID'=ClientID ,'Pin Code'=PinCode ,'First Name'=FirstName ,
                              'Last Name'=LastName ,Balance , Email , Phone ,'Date Of Birth'=DateOfBirth from Clients
                              Inner Join People On People.PersonID = Clients.PersonID;";

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
                // //.Show(e.ToString());
            }
            finally
            {
                connection.Close();
            }

            return dt;
        }

        public static bool GetClientById(int id, ref string pinCode, ref decimal balance, ref int personId)
        {
            var isFound = false;

            SqlConnection connection = new SqlConnection(ClsDataAccessSettings.ConnectionString);

            string query = "Select * from Clients Where ClientID=@ID";

            SqlCommand command = new SqlCommand(query, connection);
            command.Parameters.AddWithValue("@ID", id);

            try
            {
                connection.Open();
                SqlDataReader reader = command.ExecuteReader();
                if (reader.Read())
                {
                    isFound = true;
                    pinCode = Convert.ToString(reader[1])!;
                    balance = Convert.ToDecimal(reader[2]);
                    personId = Convert.ToInt32(reader[3]);
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
        
        public static int AddNewClient(string pinCode, decimal balance, int personId)
        {
            int id = 0;
            SqlConnection connection = new SqlConnection(ClsDataAccessSettings.ConnectionString);

            string query = @"INSERT INTO Clients
                             VALUES (@pinCode,@balance,@PersonID)
                             SELECT SCOPE_IDENTITY();";

            SqlCommand command = new SqlCommand(query, connection);

            command.Parameters.AddWithValue("@pinCode", pinCode);
            command.Parameters.AddWithValue("@balance", balance);
            command.Parameters.AddWithValue("@PersonID", personId);

            try
            {
                connection.Open();
                var result = command.ExecuteScalar();

                if (result != null && int.TryParse(result.ToString(), out int insertedID))
                {
                    id = insertedID;
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

            return id;
        }

        public static bool UpdateClient(int clientId, string pinCode, decimal balance, int personId)
        {
            bool isUpdated = false;

            SqlConnection connection = new SqlConnection(ClsDataAccessSettings.ConnectionString);

            string query = @"Update Clients
                            set pinCode=@pinCode,balance=@balance,PersonID=@PersonID
                            where ClientId = @ClientId";

            SqlCommand command = new SqlCommand(query, connection);

            command.Parameters.AddWithValue("@ClientId", clientId);
            command.Parameters.AddWithValue("@pinCode", pinCode);
            command.Parameters.AddWithValue("@balance", balance);
            command.Parameters.AddWithValue("@PersonID", personId);

            try
            {
                connection.Open();

                int rowsAffected = command.ExecuteNonQuery();

                isUpdated = rowsAffected > 0;

                connection.Close();
            }
            catch (Exception ex)
            {
                //.Show(ex + "");
                isUpdated = false;
            }

            finally
            {
                connection.Close();
            }

            // //.Show(isUpdated + "");
            return isUpdated;
        }

        public static bool DeleteClient(int clientId)
        {
            bool isDeleted = false;
            SqlConnection connection = new SqlConnection(ClsDataAccessSettings.ConnectionString);

            string Query = @" Delete From Clients Where ClientID =@ClientID ;";

            SqlCommand command = new SqlCommand(Query, connection);
            command.Parameters.AddWithValue("@ClientID", clientId);

            try
            {
                connection.Open();
                var rows = command.ExecuteNonQuery();
                isDeleted = rows > 0;
            }
            catch (Exception e)
            {
                // //.Show(e.ToString());
                isDeleted = false;
            }
            finally
            {
                connection.Close();
            }

            return isDeleted;
        }

        public static bool ExistPinCode(string pinCode)
        {
            bool isFound = false;

            SqlConnection connection = new SqlConnection(ClsDataAccessSettings.ConnectionString);

            string query = @"Select Found='1' From Clients
                             Where PinCode = @PinCode";

            SqlCommand command = new SqlCommand(query, connection);

            command.Parameters.AddWithValue("@PinCode", pinCode);

            try
            {
                connection.Open();

                SqlDataReader reader = command.ExecuteReader();

                if (reader.Read())
                {
                    isFound = reader.HasRows;
                }

                connection.Close();
            }
            catch (Exception ex)
            {
                //.Show(ex + "");
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