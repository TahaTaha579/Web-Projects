using System.Data;
using DataAccessLayer;

namespace BusinessLayer
{
    public class ClientsBusinessLayer : PeopleBusinessLayer
    {
        public int ClientId { get; set; }

        public string PinCode { get; set; }
        public decimal Balance { get; set; }

        private static readonly Random Random = new();
        private static readonly object SyncLock = new();

        private static int RandomNumber(int min, int max)
        {
            lock (SyncLock)
            {
                return Random.Next(min, max);
            }
        }

        private static string GetRandomPinCode()
        {
            string pinCode;

            do
            {
                pinCode = "";

                for (var i = 0; i < 4; i++)
                {
                    pinCode += Convert.ToChar(RandomNumber(48, 57));
                }
            } while (ExistPinCode(pinCode));

            return pinCode;
        }

        private static bool ExistPinCode(string pinCode)
        {
            return ClientsDataAccessLayer.ExistPinCode(pinCode);
        }

        public ClientsBusinessLayer()
        {
            ClientId = PersonId = -1;
            Balance = 0;
            ImagePath = "";
            PinCode = "";
        }

        private ClientsBusinessLayer(int clientId, string pinCode, decimal balance, int personId)
        {
            this.ClientId = clientId;
            PinCode = pinCode;
            Balance = balance;
            PersonId = personId;
            var personInfo = FindPerson(PersonId);
            FirstName = personInfo.FirstName;
            LastName = personInfo.LastName;
            Email = personInfo.Email;
            Phone = personInfo.Phone;
            DateOfBirth = personInfo.DateOfBirth;
            ImagePath = personInfo.ImagePath;
        }

        public static int GetTotalClients()
        {
            return ClientsDataAccessLayer.GetTotalClients();
        }

        public static DataTable GetAllClients()
        {
            return ClientsDataAccessLayer.GetAllClients();
        }

        public static ClientsBusinessLayer? FindClient(int id)
        {
            var pinCode = "";
            decimal balance = -1;
            var personId = -1;

            if (ClientsDataAccessLayer.GetClientById(id, ref pinCode, ref balance, ref personId))
                return new ClientsBusinessLayer(id, pinCode, balance, personId);

            return null;
        }

        private int _AddNewClient()
        {
            PinCode = GetRandomPinCode();
            return ClientsDataAccessLayer.AddNewClient(PinCode, Balance, PersonId);
        }

        private bool _UpdateClient()
        {
            return ClientsDataAccessLayer.UpdateClient(ClientId, PinCode, Balance, PersonId);
        }

        public new bool Save()
        {
            if (!base.Save())
                return false;

            if (this.ClientId != -1) return _UpdateClient();

            ClientId = _AddNewClient();
            return true;
        }

        public bool Delete()
        {
            var isClientDeleted = ClientsDataAccessLayer.DeleteClient(ClientId);

            if (!isClientDeleted)
                return false;

            var isPersonDeleted = DeletePerson(PersonId);
            return isPersonDeleted;
        }

        public bool Deposit(decimal amount)
        {
            Balance += amount;
            return Save();
        }

        public bool Withdraw(decimal amount)
        {
            if (amount > Balance)
                return false;

            Balance -= amount;
            return Save();
        }

        public bool Transfer(decimal amount, ClientsBusinessLayer destinationClient, int userId)
        {
            if (amount > Balance) return false;

            Withdraw(amount);
            destinationClient.Deposit(amount);

            var transfer1 = new TransfersBusinessLayer
            {
                FromClientId = ClientId,
                ToClientId = destinationClient.ClientId,
                Amount = amount,
                TransferDate = DateTime.Now,
                ByUserId = userId
            };

            return transfer1.Save();
        }
    }
}