using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Drawing;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace TelephoneApp
{
    public partial class RequestItem : UserControl
    {
        public RequestItem()
        {
            InitializeComponent();
        }

        public void SetInfor(string adress, int status)
        {
            lbAdress.Text = adress;
            switch (status)
            {
                case 1:
                    lbStatus.Text = "Chưa được định vị";
                    break;
                case 2:
                    lbStatus.Text = "Đã định vị";
                    break;
                case 3:
                    lbStatus.Text = "Không có xe nhận";
                    break;
                case 4:
                    lbStatus.Text = "Đã có xe nhận";
                    break;
                case 5:
                    lbStatus.Text = "Đang di chuyển";
                    break;
                case 6:
                    lbStatus.Text = "Đã hoàn thành";
                    break;
            }
        }
    }
}
