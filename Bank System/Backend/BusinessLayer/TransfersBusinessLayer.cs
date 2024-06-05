using System.Data;
using DataAccessLayer;

namespace BusinessLayer
{
    public class TransfersBusinessLayer
    {
        public int TransferId { get; set; }
        public int FromClientId { get; set; }
        public ClientsBusinessLayer FromClientInfo;
        public int ToClientId { get; set; }
        public ClientsBusinessLayer ToClientInfo;
        public decimal Amount { get; set; }
        public DateTime TransferDate { get; set; }

        public int ByUserId { get; set; }

        public TransfersBusinessLayer()
        {
            TransferId = FromClientId = ToClientId = ByUserId = -1;
            FromClientInfo = ToClientInfo = new ClientsBusinessLayer();
        }

        private TransfersBusinessLayer(int transferId, int fromClientId, int toClientId,
            decimal amount, DateTime transferDate, int byUserId)
        {
            TransferId = transferId;
            FromClientId = fromClientId;
            FromClientInfo = ClientsBusinessLayer.FindClient(FromClientId)!;
            ToClientId = toClientId;
            ToClientInfo = ClientsBusinessLayer.FindClient(ToClientId)!;
            Amount = amount;
            TransferDate = transferDate;
            ByUserId = byUserId;
        }

        public static int GetTotalTransfers()
        {
            return TransfersDataAccessLayer.GetTotalTransfers();
        }

        public static DataTable GetAllTransfers()
        {
            return TransfersDataAccessLayer.GetAllTransfers();
        }

        private int _AddNewTransfer()
        {
            return TransfersDataAccessLayer.AddNewTransfer(FromClientId, ToClientId, Amount, TransferDate, ByUserId);
        }

        public bool Save()
        {
            TransferId = _AddNewTransfer();
            return true;
        }
    }
}