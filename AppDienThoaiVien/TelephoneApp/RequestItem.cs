using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TelephoneApp
{
    public class RequestItem
    {
        [JsonProperty("addressold")]
        public string addressold { get; set; }
        [JsonProperty("statusforreq")]
        public int statusforreq { get; set; }
        [JsonProperty("timereq")]
        public long timereq { get; set; }
        [JsonProperty("typeofcar")]
        public int typeofcar { get; set; }
        [JsonProperty("name")]
        public string name { get; set; }
        [JsonProperty("phone")]
        public string phone { get; set; }
    }
}
