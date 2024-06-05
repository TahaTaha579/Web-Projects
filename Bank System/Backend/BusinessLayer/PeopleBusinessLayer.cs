using System.Data;
using DataAccessLayer;

namespace BusinessLayer
{
    public class PeopleBusinessLayer
    {
        public int PersonId { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }
        public DateTime DateOfBirth { get; set; }
        public string ImagePath { get; set; }

        public PeopleBusinessLayer()
        {
            PersonId = -1;
        }

        private PeopleBusinessLayer(int personId, string firstName, string lastName, string email,
            string phone, DateTime dateOfBirth, string imagePath)
        {
            PersonId = personId;
            FirstName = firstName;
            LastName = lastName;
            Email = email;
            Phone = phone;
            DateOfBirth = dateOfBirth;
            ImagePath = imagePath;
        }
        
        public static PeopleBusinessLayer FindPerson(int id)
        {
            string firstName = "", lastName = "", email = "", phone = "", imagePath = "";
            var dateOfBirth = default(DateTime);

            if (PeopleDataAccessLayer.GetPersonById(id, ref firstName, ref lastName, ref email, ref phone,
                    ref dateOfBirth, ref imagePath))
                return new PeopleBusinessLayer(id, firstName, lastName, email, phone, dateOfBirth, imagePath);

            return null;
        }

        private int _AddNewPerson()
        {
            return PeopleDataAccessLayer.AddNewPerson(FirstName, LastName, Email, Phone, DateOfBirth, ImagePath);
        }

        private bool _UpdatePerson()
        {
            return PeopleDataAccessLayer.UpdatePerson(PersonId, FirstName, LastName, Email, Phone,
                DateOfBirth, ImagePath);
        }

        public bool Save()
        {
            if (this.PersonId != -1) return _UpdatePerson();

            PersonId = _AddNewPerson();
            return true;
        }

        public bool DeletePerson(int id)
        {
            return PeopleDataAccessLayer.DeletePerson(id);
        }
    }
}