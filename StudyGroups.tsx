import React, { useState, useEffect } from 'react';

export interface StudyItem {
  id: string;
  title: string;
  type: 'quiz' | 'summary';
  date: string;
}

export interface Group {
  id: string;
  name: string;
  icon: string;
  items: StudyItem[];
}

interface StudyGroupsProps {
  onSelectItem?: (item: StudyItem) => void;
}

export const StudyGroups: React.FC<StudyGroupsProps> = ({ onSelectItem }) => {
  const [groups, setGroups] = useState<Group[]>(() => {
    const saved = localStorage.getItem('study_groups');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [
      {
        id: '1',
        name: 'الكيمياء',
        icon: '🧪',
        items: [
          { id: 'q1', title: 'اختبار تفاعلات الفلزات', type: 'quiz', date: '2026-09-15' },
          { id: 's1', title: 'ملخص معادلات الأكسدة والإختزال', type: 'summary', date: '2026-09-18' }
        ]
      },
      {
        id: '2',
        name: 'الرياضيات',
        icon: '📐',
        items: [
          { id: 'q2', title: 'اختبار المعادلة التربيعية', type: 'quiz', date: '2026-09-12' }
        ]
      }
    ];
  });

  const [activeGroupId, setActiveGroupId] = useState<string>('1');
  const [newGroupName, setNewGroupName] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    localStorage.setItem('study_groups', JSON.stringify(groups));
  }, [groups]);

  const handleAddGroup = () => {
    if (!newGroupName.trim()) return;
    const newGroup: Group = {
      id: Date.now().toString(),
      name: newGroupName.trim(),
      icon: '📁',
      items: []
    };
    setGroups([...groups, newGroup]);
    setActiveGroupId(newGroup.id);
    setNewGroupName('');
    setShowAddModal(false);
  };

  const activeGroup = groups.find((g) => g.id === activeGroupId) || groups[0];

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden dir-rtl">
      {/* Header */}
      <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-slate-50">
        <div>
          <h2 className="text-xl font-bold text-gray-800">مجموعاتي الدراسية</h2>
          <p className="text-xs text-gray-500 mt-1">نظم امتحاناتك وملخصاتك حسب المادة</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-xl transition-all flex items-center gap-1 shadow-sm"
        >
          <span>+</span> مجلد جديد
        </button>
      </div>

      {/* Group Tabs */}
      <div className="flex border-b border-gray-100 overflow-x-auto p-2 gap-2 bg-gray-50/50">
        {groups.map((group) => (
          <button
            key={group.id}
            onClick={() => setActiveGroupId(group.id)}
            className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all whitespace-nowrap flex items-center gap-2 ${
              activeGroupId === group.id
                ? 'bg-white text-blue-600 shadow-sm border border-gray-200/80 font-bold'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <span>{group.icon}</span>
            <span>{group.name}</span>
            <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full mr-1">
              {group.items.length}
            </span>
          </button>
        ))}
      </div>

      {/* Items List */}
      <div className="p-5">
        {activeGroup && activeGroup.items.length > 0 ? (
          <div className="grid gap-3">
            {activeGroup.items.map((item) => (
              <div
                key={item.id}
                onClick={() => onSelectItem && onSelectItem(item)}
                className="p-4 rounded-xl border border-gray-100 hover:border-blue-200 hover:bg-blue-50/30 transition-all cursor-pointer flex justify-between items-center group"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">
                    {item.type === 'quiz' ? '📝' : '📄'}
                  </span>
                  <div>
                    <h4 className="text-sm font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">
                      {item.title}
                    </h4>
                    <span className="text-xs text-gray-400">{item.date}</span>
                  </div>
                </div>
                <span className="text-xs px-2.5 py-1 rounded-md bg-gray-100 text-gray-600 group-hover:bg-blue-100 group-hover:text-blue-700 font-medium">
                  {item.type === 'quiz' ? 'اختبار' : 'ملخص'}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-10 text-gray-400">
            <p className="text-3xl mb-2">📂</p>
            <p className="text-sm">لا توجد امتحانات أو ملخصات محفوظة في هذا المجلد بعد.</p>
          </div>
        )}
      </div>

      {/* Modal - Add New Group */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl dir-rtl">
            <h3 className="text-lg font-bold text-gray-800 mb-4">إضافة مجلد جديد</h3>
            <input
              type="text"
              placeholder="اسم المادة (مثلاً: الفيزياء)..."
              value={newGroupName}
              onChange={(e) => setNewGroupName(e.target.value)}
              className="w-full p-3 border border-gray-200 rounded-xl mb-4 text-sm focus:outline-none focus:border-blue-500"
            />
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-100 rounded-xl"
              >
                إلغاء
              </button>
              <button
                onClick={handleAddGroup}
                className="px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-xl hover:bg-blue-700 shadow-sm"
              >
                حفظ المجلد
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudyGroups;
