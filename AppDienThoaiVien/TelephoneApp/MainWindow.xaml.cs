using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Data;
using System.Windows.Documents;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Media.Imaging;
using System.Windows.Navigation;
using System.Windows.Shapes;
using MahApps.Metro.Controls;
using MahApps.Metro;
using System.Globalization;
using System.Net.Http;
using Firebase.Database;
using System.Threading;
using System.Net.Http.Headers;
using System.Configuration;
using Firebase.Database.Query;
using System.Windows.Threading;
using System.Collections.ObjectModel;
using System.ComponentModel;
using System.Net;
using Newtonsoft.Json;

namespace TelephoneApp
{
    /// <summary>
    /// Interaction logic for MainWindow.xaml
    /// </summary>
    public partial class MainWindow : MetroWindow
    {
        public static HttpClient HTTP_CLIENT = new HttpClient();

        public FirebaseClient firebase = new FirebaseClient("https://barg-firebase.firebaseio.com/");

        private ObservableCollection<RequestHistory> items = new ObservableCollection<RequestHistory>();

        public MainWindow()
        {
            InitializeComponent();
            //items.Add(new RequestHistory("A10/299, Phong Phú, Bình Chánh, TP Hồ Chí Minh", 1, "premium"));
            //items.Add(new RequestHistory("A10/299, Phong Phú, Bình Chánh, TP Hồ Chí Minh", 2, "normal"));
            //items.Add(new RequestHistory("A10/299, Phong Phú, Bình Chánh, TP Hồ Chí Minh", 3, "normal"));
            //items.Add(new RequestHistory("A10/299, Phong Phú, Bình Chánh, TP Hồ Chí Minh", 4, "normal"));
            //items.Add(new RequestHistory("A10/299, Phong Phú, Bình Chánh, TP Hồ Chí Minh", 5, "normal"));
            //items.Add(new RequestHistory("A10/299, Phong Phú, Bình Chánh, TP Hồ Chí Minh", 6, "normal"));
            lvLichSuKhachHang.ItemsSource = items;


            Thread thread = new Thread(new ThreadStart(LoadTypeCars));

            thread.Start();
            Console.WriteLine("time " + DateTime.Now.Ticks);

            //Configuration configuration = ConfigurationManager.OpenExeConfiguration(ConfigurationUserLevel.PerUserRoamingAndLocal);
            //var serviceModelSectionGroup = ServiceModelSectionGroup.GetSectionGroup(configuration);
            //var services = serviceModelSectionGroup.Services;
            string baseAddress = "https://barg-server.herokuapp.com/";
            HTTP_CLIENT.BaseAddress = new Uri(baseAddress);
            HTTP_CLIENT.DefaultRequestHeaders.Accept.Add(
                new MediaTypeWithQualityHeaderValue("application/json"));

        }

        delegate void LoadTypeCarCallback();

        public async void LoadTypeCars()
        {
            var typecars = await firebase
              .Child("typecars")
              .OrderByKey()
              .OnceAsync<TypeCar>();

            if (!cbbLoaiXe.Dispatcher.CheckAccess())
            {
                LoadTypeCarCallback d = new LoadTypeCarCallback(LoadTypeCars);
                cbbLoaiXe.Dispatcher.Invoke(d);
            }
            else
            {
                foreach (var type in typecars)
                {
                    cbbLoaiXe.Items.Add(type.Object);
                }

                cbbLoaiXe.DisplayMemberPath = "Name";

                cbbLoaiXe.SelectedIndex = 0;
            }
        }

        //delegate void PanelAddControllCallback();

        private async void CheckPhoneNumber()
        {
            string phone = "";
            App.Current.Dispatcher.Invoke((Action)delegate
            {
                items.Clear();
                phone = txtSoDienThoai.Text;
                phone = phone.Trim();
            });
            
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

                        try
                        {
                            var requestNew = await firebase
                              .Child("customers/" + phone + "/request")
                              .OnceSingleAsync<RequestNew>();
                            if (requestNew == null)
                            {
                                App.Current.Dispatcher.Invoke((Action)delegate
                                {
                                    RequestHistory req = new RequestHistory(requestNew.address, requestNew.statusforreq, requestNew.typeofcar);
                                    items.Add(req);
                                });
                            }
                        }catch(Exception ex)
                        {
                            Console.WriteLine(ex.Message);
                        }

                        try
                        {
                            var requests = await firebase
                            .Child("customers/" + phone + "/histories")
                            .OnceAsync<Request>();


                            foreach (var request in requests)
                            {
                                App.Current.Dispatcher.Invoke((Action)delegate
                                {
                                    RequestHistory his = new RequestHistory(request.Object.address, request.Object.statusforreq, request.Object.typeofcar);
                                    items.Add(his);
                                });

                            }
                        }
                        catch(Exception ex)
                        {
                            Console.WriteLine(ex.Message);
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
            }
        }

        private void txtSoDienThoai_LostFocus(object sender, RoutedEventArgs e)
        {
            Thread thread = new Thread(new ThreadStart(CheckPhoneNumber));
            thread.Start();
        }

        private async void btnGui_Click(object sender, RoutedEventArgs e)
        {
            if (!string.IsNullOrEmpty(txtSoDienThoai.Text) && !string.IsNullOrEmpty(txtHoTen.Text) && !string.IsNullOrEmpty(txtViTri.Text))
            {
                try
                {
                    //Console.WriteLine("3");
                    if (cbbLoaiXe.SelectedIndex > -1)
                    {
                        RequestItem request = new RequestItem();
                        request.addressold = txtViTri.Text;
                        request.phone = txtSoDienThoai.Text;
                        request.statusforreq = 1;
                        request.typeofcar = ((TypeCar)cbbLoaiXe.SelectedItem).Id;
                        request.timereq = DateTime.Now.Ticks;
                        request.name = txtHoTen.Text;

                        HttpResponseMessage result = await SendCustomerToServer(request);
                        if (result.StatusCode == HttpStatusCode.OK)
                        {
                            string str = await result.Content.ReadAsStringAsync();
                            MessageBox.Show("Gửi thành công");
                        }
                        else
                        {
                            MessageBox.Show("Gửi thất bại");
                        }
                    }
                }
                catch (Exception ex)
                {
                    Console.WriteLine(ex.Message);
                }
            }

        }

        private void btnHuy_Click(object sender, RoutedEventArgs e)
        {

        }

        public async Task<HttpResponseMessage> SendCustomerToServer(RequestItem request)
        {
            // customers/:phone/:name/:addressold/:typeofcar/:timereq/:statusforreq
            var myContent = JsonConvert.SerializeObject(request);
            var buffer = System.Text.Encoding.UTF8.GetBytes(myContent);
            var byteContent = new ByteArrayContent(buffer);
            byteContent.Headers.ContentType = new MediaTypeHeaderValue("application/json");
            HttpResponseMessage response = await HTTP_CLIENT.PostAsync("dienthoaivien/customers", byteContent);

            return response;
        }

        private void txtSoDienThoai_KeyDown(object sender, KeyEventArgs e)
        {
            if (e.Key == Key.Enter)
            {
                Thread thread = new Thread(new ThreadStart(CheckPhoneNumber));
                thread.Start();

                txtHoTen.Focus();
                txtHoTen.SelectAll();
            }
        }

        private void txtHoTen_KeyDown(object sender, KeyEventArgs e)
        {
            if (e.Key == Key.Enter)
            {
                txtViTri.Focus();
                txtViTri.SelectAll();
            }
        }

        private void txtViTri_KeyDown(object sender, KeyEventArgs e)
        {
            if (e.Key == Key.Enter)
            {
                btnGui.Focus();
            }
        }
    }
}
