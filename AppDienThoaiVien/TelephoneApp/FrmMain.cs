using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;
using Firebase.Database;
using Firebase.Database.Query;

namespace TelephoneApp
{
    public partial class FrmMain : Form
    {
        public static HttpClient client;
        public FirebaseClient firebase = new FirebaseClient("https://barg-firebase.firebaseio.com/");

        public FrmMain()
        {
            InitializeComponent();

            cbbLoaiXe.DisplayMember = "Loại 1";
            cbbLoaiXe.ValueMember = "1";
            cbbLoaiXe.DisplayMember = "Loại 2";
            cbbLoaiXe.ValueMember = "2";

            client = new HttpClient();
            client.BaseAddress = new Uri("http://localhost:7000/");
            client.DefaultRequestHeaders.Accept.Clear();
            client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));


        }

        private void minimize_Click(object sender, EventArgs e)
        {
            if (this.WindowState != FormWindowState.Minimized)
            {
                this.WindowState = FormWindowState.Minimized;
            }
        }

        private void Maximize_Click(object sender, EventArgs e)
        {
            if (this.WindowState == FormWindowState.Maximized)
            {
                this.WindowState = FormWindowState.Normal;
            }
            else if (this.WindowState == FormWindowState.Normal)
            {
                this.WindowState = FormWindowState.Maximized;
            }
        }

        private void close_Click(object sender, EventArgs e)
        {
            Application.Exit();

        }

        private void PnTitle_MouseMove(object sender, MouseEventArgs e)
        {
            Them.SetLocation(this);

        }

        private void PnTitle_MouseUp(object sender, MouseEventArgs e)
        {
            Them.Drag();

        }

        private void PnTitle_MouseDown(object sender, MouseEventArgs e)
        {
            Them.GetLocation(this);
        }
        

        private async void CheckPhoneNumber(string phone)
        {
            

            var customers = await firebase
              .Child("customers")
              .OrderByKey()
              .OnceAsync<Customer>();

            bool hasKey = false;

            foreach (var customer in customers)
            {
                Console.WriteLine($"{customer.Key}");
                if(customer.Key == phone)
                {
                    hasKey = true;
                }
            }

            if (hasKey)
            {
                var requests = await firebase.Child("customers").Child(phone).OrderByKey().OnceAsync<Request>();
                foreach(var request in requests)
                {
                    Console.WriteLine(request.Object.Adress);
                }
            }
        }

        private async void BtnSend_ClickAsync(object sender, EventArgs e)
        {
            CheckPhoneNumber("");
            //HttpResponseMessage result = await SendPoint();
            //if (result.StatusCode == System.Net.HttpStatusCode.OK)
            //{
            //    var url = await result.Content.ReadAsStringAsync();
            //    var res = JsonConvert.DeserializeObject<Object>(url);

            //    if (res != null)
            //    {
            //        MessageBox.Show("đã gửi thành công !!! " + res.ToString());
            //    }
            //    this.Close();
            //}
        }

        private void txtSDT_KeyDown(object sender, KeyEventArgs e)
        {

        }
    }
}
