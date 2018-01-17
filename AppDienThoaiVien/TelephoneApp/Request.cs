using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TelephoneApp
{
    public class Request
    {
        public string address { get; set; }
        public string addressold { get; set; }
        public string name { get; set; }
        public string phone { get; set; }
        public int statusforreq { get; set; }
        public long timereq { get; set; }
        public int typeofcar { get; set; }
    }
}
