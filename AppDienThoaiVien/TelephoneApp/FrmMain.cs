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
using System.Configuration;
using System.ServiceModel.Configuration;
using System.Threading;
using System.Net;

namespace TelephoneApp
{
    public partial class FrmMain : Form
    {
        public static HttpClient HTTP_CLIENT = new HttpClient();

        public FirebaseClient firebase = new FirebaseClient("https://barg-firebase.firebaseio.com/");

        public FrmMain()
        {
            InitializeComponent();

            Thread thread = new Thread(new ThreadStart(LoadTypeCars));

            thread.Start();
            Console.WriteLine("time " + DateTime.Now.Ticks);

            var configuration = ConfigurationManager.OpenExeConfiguration(ConfigurationUserLevel.PerUserRoamingAndLocal);
            var serviceModelSectionGroup = ServiceModelSectionGroup.GetSectionGroup(configuration);
            var services = serviceModelSectionGroup.Services;
            string baseAddress = services.Services[0].Host.BaseAddresses[0].BaseAddress.ToString();
            HTTP_CLIENT.BaseAddress = new Uri(baseAddress);
            HTTP_CLIENT.DefaultRequestHeaders.Accept.Add(
                new MediaTypeWithQualityHeaderValue("application/json"));
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

        delegate void LoadTypeCarCallback();

        public async void LoadTypeCars()
        {
            var typecars = await firebase
              .Child("typecars")
              .OrderByKey()
              .OnceAsync<TypeCar>();

            if (cbbLoaiXe.InvokeRequired)
            {
                LoadTypeCarCallback d = new LoadTypeCarCallback(LoadTypeCars);
                this.Invoke(d);
            }
            else
            {
                foreach (var type in typecars)
                {
                    cbbLoaiXe.Items.Add(type.Object);
                }

                cbbLoaiXe.DisplayMember = "Name";
                cbbLoaiXe.ValueMember = "Id";

                cbbLoaiXe.SelectedIndex = 0;
            }
        }

        delegate void PanelAddControllCallback();

        private async void CheckPhoneNumber()
        {
            string phone = txtSDT.Text;
            phone = phone.Trim();
            try
            {
                string name = null;
                var customers = await firebase
                  .Child("customers")
                  .OrderByKey()
                  .OnceAsync<Customer>();

                foreach (var customer in customers)
                {
                   
                    if (customer.Key.ToString().Trim().Equals(phone))
                    {
                        phone = customer.Key;
                        name = customer.Object.name;

                        var requestNew = await firebase
                              .Child("customers/" + phone + "/request")
                              .OnceSingleAsync<RequestNew>();

                        RequestItem requestItem1 = new RequestItem();
                        requestItem1.SetInfor(requestNew.address, requestNew.statusforreq);

                        if (flpanel.InvokeRequired)
                        {
                            PanelAddControllCallback d = new PanelAddControllCallback(CheckPhoneNumber);
                            flpanel.Invoke(d);
                        }
                        else
                        {
                            flpanel.Controls.Add(requestItem1);
                            txtHoTen.Text = name;
                        }
                        
                        var requests = await firebase
                            .Child("customers/" + phone + "/histories")
                            .OnceAsync<Request>();


                        foreach (var request in requests)
                        {
                            //Console.WriteLine($"{request.Key}");
                            if (request.Object.phone == phone)
                            {
                                RequestItem requestItem = new RequestItem();
                                requestItem.SetInfor(request.Object.address, request.Object.statusforreq);


                                if (flpanel.InvokeRequired)
                                {
                                    PanelAddControllCallback d = new PanelAddControllCallback(CheckPhoneNumber);
                                    flpanel.Invoke(d);
                                }
                                else
                                {
                                    flpanel.Controls.Add(requestItem);
                                }
                                
                            }
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
            }
        }

        private async void BtnSend_Click(object sender, EventArgs e)
        {
            if (!string.IsNullOrEmpty(txtSDT.Text) && !string.IsNullOrEmpty(txtHoTen.Text) && !string.IsNullOrEmpty(txtVitri.Text))
            {
                try
                {
                    //Console.WriteLine("3");
                    if (cbbLoaiXe.SelectedIndex > -1)
                    {
                        string[] content = new string[6];
                        content[0] = txtSDT.Text;
                        content[1] = txtHoTen.Text;
                        content[2] = txtVitri.Text;
                        content[3] = ((TypeCar)cbbLoaiXe.SelectedItem).Id.ToString();
                        content[4] = DateTime.Now.Ticks.ToString();
                        content[5] = "1";

                        HttpResponseMessage result = await SendCustomerToServer(content);
                        if (result.StatusCode == HttpStatusCode.OK)
                        {
                            string str = await result.Content.ReadAsStringAsync();
                            MessageBox.Show("Gửi thành công");
                        }
                        else
                        {
                            if (result.StatusCode == HttpStatusCode.NoContent)
                            {
                                //MessageBox.Show("Tài khoản hoặc mật khẩu không đúng");
                            }
                            else
                            {
                                //MessageBox.Show("Gateway time out");
                            }
                        }
                    }
                }
                catch(Exception ex)
                {

                }
            }
        }

        public async Task<HttpResponseMessage> SendCustomerToServer(String[] ds)
        {
            // customers/:phone/:name/:addressold/:typeofcar/:timereq/:statusforreq
            HttpResponseMessage response = await HTTP_CLIENT.GetAsync(String.Format("api/customers/{0}/{1}/{2}/{3}/{4}/{5}", ds[0], ds[1], ds[2], ds[3], ds[4], ds[5]));

            return response;
        }

        private void txtSDT_KeyDown(object sender, KeyEventArgs e)
        {
            if (e.KeyCode == Keys.Enter)
            {
                Thread thread = new Thread(new ThreadStart(CheckPhoneNumber));
                thread.Start();

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
            Thread thread = new Thread(new ThreadStart(CheckPhoneNumber));
            thread.Start();
        }
    }
}
