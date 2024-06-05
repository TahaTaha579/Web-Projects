using System.Data;
using System.Data.SqlClient;

namespace DataAccessLayer
{
    public class PeopleDataAccessLayer
    {

        public static bool GetPersonById(int id, ref string firstName, ref string lastName, ref string email,
            ref string phone, ref DateTime dateOfBirth, ref string imagePath)
        {
            bool isFound = false;

            SqlConnection connection = new SqlConnection(ClsDataAccessSettings.ConnectionString);

            string query = "Select * from People Where PersonID=@ID";

            SqlCommand command = new SqlCommand(query, connection);
            command.Parameters.AddWithValue("@ID", id);

            try
            {
                connection.Open();
                SqlDataReader reader = command.ExecuteReader();
                if (reader.Read())
                {
                    isFound = true;
                    firstName = (string)reader[1];
                    lastName = (string)reader[2];
                    email = (string)reader[3];
                    phone = (string)reader[4];
                    dateOfBirth = (DateTime)reader[5];
                    imagePath = reader[6] != DBNull.Value ? (string)reader[6] : "";
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

        public static int AddNewPerson(string firstName, string lastName, string email,
            string phone, DateTime dateOfBirth, string imagePath)
        {
            int Id = 0;
            SqlConnection connection = new SqlConnection(ClsDataAccessSettings.ConnectionString);

            string query = @"INSERT INTO People
                             VALUES (@firstName,@lastName,@email,@phone,@dateOfBirth,@imagePath)
                             SELECT SCOPE_IDENTITY();";

            SqlCommand command = new SqlCommand(query, connection);

            command.Parameters.AddWithValue("@firstName", firstName);
            command.Parameters.AddWithValue("@lastName", lastName);
            command.Parameters.AddWithValue("@email", email);
            command.Parameters.AddWithValue("@phone", phone);
            command.Parameters.AddWithValue("@dateOfBirth", dateOfBirth);
            if (imagePath != "")
                command.Parameters.AddWithValue("@ImagePath", imagePath);
            else
                command.Parameters.AddWithValue("@ImagePath", DBNull.Value);

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

        public static bool UpdatePerson(int personId, string firstName, string lastName, string email,
            string phone, DateTime dateOfBirth, string imagePath)
        {
            bool isUpdated = false;

            SqlConnection connection = new SqlConnection(ClsDataAccessSettings.ConnectionString);

            string query = @"Update People
                            set firstName=@firstName,lastName=@lastName, email= @email ,
                                phone=@phone,dateOfBirth=@dateOfBirth ,imagePath = @imagePath
                            where PersonId = @PersonId";

            SqlCommand command = new SqlCommand(query, connection);

            command.Parameters.AddWithValue("@PersonId", personId);
            command.Parameters.AddWithValue("@firstName", firstName);
            command.Parameters.AddWithValue("@lastName", lastName);
            command.Parameters.AddWithValue("@email", email);
            command.Parameters.AddWithValue("@phone", phone);
            command.Parameters.AddWithValue("@dateOfBirth", dateOfBirth);
            if (imagePath != "")
                command.Parameters.AddWithValue("@ImagePath", imagePath);
            else
                command.Parameters.AddWithValue("@ImagePath", DBNull.Value);

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

        public static bool DeletePerson(int personId)
        {
            bool isDeleted = false;
            SqlConnection connection = new SqlConnection(ClsDataAccessSettings.ConnectionString);

            string Query = "Delete from People Where PersonID=@PersonID";

            SqlCommand command = new SqlCommand(Query, connection);
            command.Parameters.AddWithValue("@PersonID", personId);

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
    }
}