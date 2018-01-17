using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Data;
using System.Windows.Media;

namespace TelephoneApp
{
    public class HistoryStatusConverter : IValueConverter
    {
        public object Convert(object value, Type targetType, object parameter, CultureInfo culture)
        {
            try
            {
                switch (value)
                {
                    case 1:
                        return (SolidColorBrush)(new BrushConverter().ConvertFrom("#f5ee94"));
                    case 2:
                        return (SolidColorBrush)(new BrushConverter().ConvertFrom("#9ccf9f"));
                    case 3:
                        return (SolidColorBrush)(new BrushConverter().ConvertFrom("#f29892"));
                    case 4:
                        return (SolidColorBrush)(new BrushConverter().ConvertFrom("#aa94c6"));
                    case 5:
                        return (SolidColorBrush)(new BrushConverter().ConvertFrom("#8ac0e8"));
                    case 6:
                        return (SolidColorBrush)(new BrushConverter().ConvertFrom("#b3a19a"));
                }
                return (SolidColorBrush)(new BrushConverter().ConvertFrom("#FFF"));
            }
            catch
            {
                return (SolidColorBrush)(new BrushConverter().ConvertFrom("#FFF"));
            }
        }

        public object ConvertBack(object value, Type targetType, object parameter, CultureInfo culture)
        {
            throw new NotImplementedException();
        }
    }
}
