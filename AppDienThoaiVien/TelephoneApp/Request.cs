using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TelephoneApp
{
    public class Request
    {
        public string Adress { get; set; }
        public string Name { get; set; }
        public string Phone { get; set; }
        public int StatusForReq { get; set; }
        public long TimeReq { get; set; }
        public int TypeOfCar { get; set; }
    }
}
