using System;
using System.Collections.Generic;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Windows.Forms;

namespace TelephoneApp
{
    class Them
    {
        private static bool dragging = false;
        private static Point dragCursorPoint;
        private static Point dragFormPoint;

        public static void GetLocation(Form form)
        {
            dragging = true;
            dragCursorPoint = Cursor.Position;
            dragFormPoint = form.Location;
        }

        public static void Drag()
        {
            dragging = false;
        }

        public static void SetLocation(Form form)
        {
            if (dragging)
            {
                Point dif = Point.Subtract(Cursor.Position, new Size(dragCursorPoint));
                form.Location = Point.Add(dragFormPoint, new Size(dif));
            }
        }
    }
}
