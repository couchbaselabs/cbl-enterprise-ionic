using System;
using System.IO;
using System.Diagnostics;
using System.Reflection;
using System.Runtime.InteropServices;

public class Activator {
    public static void Activate() {
        var codeBase = Path.GetDirectoryName(typeof(Activator).GetTypeInfo().Assembly.Location);
        var codeBaseParent = Directory.GetParent(codeBase).FullName;
        var path = Path.Combine(codeBaseParent, "x64", "LiteCore.dll");
        if (!File.Exists(path)) {
            Debug.WriteLine("Unable to local LiteCore.dll");
        }
        IntPtr ret = LoadLibraryEx(path, IntPtr.Zero, 8);
        int a = Marshal.GetLastWin32Error();
        if (ret == IntPtr.Zero) {
            Debug.WriteLine("Unable to load LiteCore.dll");
        } else {
            Debug.WriteLine($"Loaded LiteCore: {ret}");
        }

        Assembly assembly = Assembly.Load("Couchbase.Lite.Support.NetDesktop");
        Type native = assembly.GetType("Couchbase.Lite.Support.NetDesktop");
        var activatedMember = native.GetField("_Activated", BindingFlags.NonPublic | BindingFlags.Static | BindingFlags.Instance | BindingFlags.Public);
        activatedMember.SetValue(null, 1);
    }
    [DllImport("kernel32", CharSet = CharSet.Unicode, SetLastError = true)]
    private static extern IntPtr LoadLibraryEx(string lpFileName, IntPtr hFile, uint dwFlags);
}
