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
        public FirebaseClient firebase = new FirebaseClient("https://barg-firebase.firebaseio.com/");

        public FrmMain()
        {
            InitializeComponent();

            LoadTypeCars();
            Console.WriteLine("time " + DateTime.Now.Ticks);
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

        public async void LoadTypeCars()
        {
            var typecars = await firebase
              .Child("typecars")
              .OrderByKey()
              .OnceAsync<TypeCar>();

            foreach(var type in typecars)
            {
                cbbLoaiXe.Items.Add(type.Object);
            }

            cbbLoaiXe.DisplayMember = "Name";
            cbbLoaiXe.ValueMember = "Id";

            cbbLoaiXe.SelectedIndex = 0;
        }

        private async void CheckPhoneNumber(string phone)
        {
            string name = null;
            var requests = await firebase
              .Child("requests")
              .OrderByKey()
              .OnceAsync<Request>();
            
            foreach (var request in requests)
            {
                Console.WriteLine($"{request.Key}");
                if(request.Object.phone == phone)
                {
                    RequestItem requestItem = new RequestItem();
                    requestItem.SetInfor(request.Object.address, request.Object.statusforreq);
                    flpanel.Controls.Add(requestItem);

                    name = request.Object.name;
                }
            }
            txtHoTen.Text = name;
            txtSDT.Text = phone;
        }

        private async void BtnSend_Click(object sender, EventArgs e)
        {
            var requests = firebase.Child("requests");

            if (!string.IsNullOrEmpty(txtSDT.Text) && !string.IsNullOrEmpty(txtHoTen.Text) && !string.IsNullOrEmpty(txtVitri.Text))
            {
                Console.WriteLine("3");
                if (cbbLoaiXe.SelectedIndex > -1)
                {
                    await requests.PostAsync(new Request { address = txtVitri.Text, addressold = txtVitri.Text, name = txtHoTen.Text, phone = txtSDT.Text, statusforreq = 1, typeofcar = ((TypeCar)cbbLoaiXe.SelectedItem).Id, timereq = DateTime.Now.Ticks });
                    MessageBox.Show("Đã gửi đi.");
                }
            }
        }

        private void txtSDT_KeyDown(object sender, KeyEventArgs e)
        {
            if (e.KeyCode == Keys.Enter)
            {
                CheckPhoneNumber(txtSDT.Text);
                
                txtHoTen.Focus();
                txtHoTen.SelectAll();
            }
        }

        private void txtHoTen_KeyDown(object sender, KeyEventArgs e)
        {
            if (e.KeyCode == Keys.Enter)
            {
                txtVitri.Focus();
                txtVitri.SelectAll();
            }
        }

        private void txtVitri_KeyDown(object sender, KeyEventArgs e)
        {
            if (e.KeyCode == Keys.Enter)
            {
                cbbLoaiXe.Focus();
            }
        }

        private void cbbLoaiXe_KeyDown(object sender, KeyEventArgs e)
        {
            if (e.KeyCode == Keys.Enter)
            {
                btnSend.Focus();
            }
        }

        private void txtSDT_Leave(object sender, EventArgs e)
        {
            CheckPhoneNumber(txtSDT.Text);
        }
    }
}
