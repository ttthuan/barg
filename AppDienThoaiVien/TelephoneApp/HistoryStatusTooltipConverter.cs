using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Data;

namespace TelephoneApp
{
    class HistoryStatusTooltipConverter : IValueConverter
    {
        public object Convert(object value, Type targetType, object parameter, CultureInfo culture)
        {
            try
            {
                switch (value)
                {
                    case 1:
                        return "Chưa được định vị";
                    case 2:
                        return "Đã định vị";
                    case 3:
                        return "Không có xe nhận";
                    case 4:
                        return "Đã có xe nhận";
                    case 5:
                        return "Đang di chuyển";
                    case 6:
                        return "Đã hoàn thành";
                }
                return "Lỗi";
            }
            catch
            {
                return "Lỗi";
            }
        }

        public object ConvertBack(object value, Type targetType, object parameter, CultureInfo culture)
        {
            throw new NotImplementedException();
        }
    }
}
